import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/geo";
import { haversine } from "@/lib/geo";
import { stakesInRect } from "@/lib/stakeIndex";
import { PROJECT_CENTER, type Match } from "@/lib/findStake";
import { GOOGLE_HYBRID_TILES } from "@/lib/googleMaps";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  kind: "crew" | "machine";
  label: string;
  sub?: string;
};

type Props = {
  position: LatLng | null;
  accuracy: number | null;
  match: Match | null;
  follow: boolean;
  onUserDrag: () => void;
  recenterNonce: number;
  pins?: MapPin[];
};

function esc(s: string) {
  return s
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;");
}

const BALLOON_MIN_ZOOM = 18;

type LL = typeof import("leaflet");

function attachCloseBalloons(
  L: LL,
  map: import("leaflet").Map,
  matchRef: { current: Match | null },
) {
  const canvas = L.DomUtil.create("canvas", "stake-canvas") as HTMLCanvasElement;
  canvas.style.pointerEvents = "none";
  map.getPanes().overlayPane.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => canvas.remove();

  const draw = () => {
    const z = map.getZoom();
    if (z < BALLOON_MIN_ZOOM) {
      if (canvas.width) {
        canvas.width = 0;
        canvas.height = 0;
      }
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "";

    const size = map.getSize();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = size.x;
    const cssH = size.y;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
    L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const b = map.getBounds();
    const visible = stakesInRect(
      {
        south: b.getSouth(),
        west: b.getWest(),
        north: b.getNorth(),
        east: b.getEast(),
      },
      48,
    );
    const skip = matchRef.current?.estaca ?? null;

    ctx.font = "700 10px IBM Plex Sans, ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const st of visible) {
      if (skip != null && st.number === skip) continue;
      const p = map.latLngToContainerPoint(st.pos);
      const label = String(st.number);
      const tw = ctx.measureText(label).width;
      const bw = tw + 8;
      const bh = 14;
      const x = p.x;
      const y = p.y - 10;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 4);
      else ctx.rect(x - bw / 2, y - bh / 2, bw, bh);
      ctx.fillStyle = "#f5c518";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillText(label, x, y + 0.5);
    }
  };

  map.on("move", draw);
  map.on("zoom", draw);
  map.on("resize", draw);
  draw();

  return () => {
    map.off("move", draw);
    map.off("zoom", draw);
    map.off("resize", draw);
    canvas.remove();
  };
}

export function StakeMap({
  position,
  accuracy,
  match,
  follow,
  onUserDrag,
  recenterNonce,
  pins = [],
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const LRef = useRef<typeof import("leaflet") | null>(null);
  const balloonRef = useRef<(import("leaflet").Marker & { _txt?: string }) | null>(null);
  const userRef = useRef<import("leaflet").CircleMarker | null>(null);
  const accRef = useRef<import("leaflet").Circle | null>(null);
  const pinLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const pinMarkersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const lastCenterRef = useRef<LatLng | null>(null);
  const draggingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const followRef = useRef(follow);
  followRef.current = follow;
  const onDragRef = useRef(onUserDrag);
  onDragRef.current = onUserDrag;
  const matchRef = useRef(match);
  matchRef.current = match;

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    let cancelled = false;
    let detach: (() => void) | undefined;

    void import("leaflet").then((mod) => {
      if (cancelled || !hostRef.current || mapRef.current) return;
      const L = mod.default;
      LRef.current = L;

      const map = L.map(hostRef.current, {
        center: [PROJECT_CENTER.lat, PROJECT_CENTER.lng],
        zoom: 18,
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: false,
        markerZoomAnimation: false,
        fadeAnimation: false,
        inertia: true,
        bounceAtZoomLimits: false,
      });
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      L.tileLayer(GOOGLE_HYBRID_TILES, {
        subdomains: ["0", "1", "2", "3"],
        maxZoom: 21,
        maxNativeZoom: 20,
        updateWhenIdle: true,
        updateWhenZooming: false,
        keepBuffer: 8,
        className: "map-tiles",
        attribution: "Google",
      }).addTo(map);

      pinLayerRef.current = L.layerGroup().addTo(map);
      detach = attachCloseBalloons(L, map, matchRef);
      map.on("dragstart", () => {
        draggingRef.current = true;
        onDragRef.current();
      });
      map.on("dragend", () => {
        draggingRef.current = false;
      });
      requestAnimationFrame(() => map.invalidateSize());

      mapRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      detach?.();
      mapRef.current?.remove();
      mapRef.current = null;
      pinMarkersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L || !position) return;
    if (!userRef.current) {
      userRef.current = L.circleMarker([position.lat, position.lng], {
        radius: 7,
        color: "#0f172a",
        weight: 2,
        fillColor: "#22d3ee",
        fillOpacity: 1,
        interactive: false,
      }).addTo(map);
      map.setView([position.lat, position.lng], map.getZoom(), { animate: false });
      lastCenterRef.current = position;
    } else {
      userRef.current.setLatLng([position.lat, position.lng]);
      const last = lastCenterRef.current;
      if (
        followRef.current &&
        !draggingRef.current &&
        (!last || haversine(last, position) > 32)
      ) {
        map.panTo([position.lat, position.lng], { animate: false });
        lastCenterRef.current = position;
      }
    }
    if (accuracy) {
      if (!accRef.current) {
        accRef.current = L.circle([position.lat, position.lng], {
          radius: accuracy,
          color: "#22d3ee",
          weight: 1,
          opacity: 0.3,
          fillColor: "#22d3ee",
          fillOpacity: 0.06,
          interactive: false,
        }).addTo(map);
      } else {
        accRef.current.setLatLng([position.lat, position.lng]);
        accRef.current.setRadius(accuracy);
      }
    }
  }, [position, accuracy, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L) return;
    if (!match) {
      balloonRef.current?.remove();
      balloonRef.current = null;
      return;
    }
    const text = `E-${match.estaca}`;
    if (!balloonRef.current) {
      balloonRef.current = L.marker([match.snapped.lat, match.snapped.lng], {
        icon: L.divIcon({
          className: "stake-balloon",
          html: `<div class="stake-balloon-inner">${text}</div>`,
          iconSize: [56, 28],
          iconAnchor: [28, 30],
        }),
        interactive: false,
        zIndexOffset: 900,
      }).addTo(map);
      balloonRef.current._txt = text;
      return;
    }
    balloonRef.current.setLatLng([match.snapped.lat, match.snapped.lng]);
    if (balloonRef.current._txt !== text) {
      balloonRef.current.setIcon(
        L.divIcon({
          className: "stake-balloon",
          html: `<div class="stake-balloon-inner">${text}</div>`,
          iconSize: [56, 28],
          iconAnchor: [28, 30],
        }),
      );
      balloonRef.current._txt = text;
    }
    map.fire("move");
  }, [match, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    const layer = pinLayerRef.current;
    if (!map || !L || !layer || !ready) return;
    const keep = new Set(pins.map((p) => p.id));
    const markers = pinMarkersRef.current;

    for (const [id, marker] of markers) {
      if (!keep.has(id)) {
        layer.removeLayer(marker);
        markers.delete(id);
      }
    }

    for (const pin of pins) {
      const existing = markers.get(pin.id);
      if (existing) {
        existing.setLatLng([pin.lat, pin.lng]);
        continue;
      }
      const marker = L.marker([pin.lat, pin.lng], {
        icon: L.divIcon({
          className: pin.kind === "machine" ? "live-pin machine" : "live-pin crew",
          html: `<div class="live-pin-inner"><i></i><b>${esc(pin.label)}</b></div>`,
          iconSize: [120, 36],
          iconAnchor: [16, 18],
        }),
        interactive: false,
        zIndexOffset: 700,
      }).addTo(layer);
      markers.set(pin.id, marker);
    }
  }, [pins, ready]);

  useEffect(() => {
    if (!recenterNonce) return;
    const map = mapRef.current;
    if (!map || !position) return;
    map.panTo([position.lat, position.lng], { animate: false });
    lastCenterRef.current = position;
  }, [recenterNonce, position]);

  return <div ref={hostRef} className="absolute inset-0 z-0 bg-bg" />;
}
