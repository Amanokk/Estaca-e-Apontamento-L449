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

const BALLOON_MIN_ZOOM = 17;

type LL = typeof import("leaflet");

function attachCloseBalloons(
  L: LL,
  map: import("leaflet").Map,
  matchRef: { current: Match | null },
) {
  const layer = L.layerGroup().addTo(map);
  const markers = new Map<number, import("leaflet").Marker>();

  const iconFor = (n: number) =>
    L.divIcon({
      className: "stake-chip",
      html: `<span class="stake-chip-inner">${n}</span>`,
      iconSize: [36, 16],
      iconAnchor: [18, 18],
    });

  const sync = () => {
    const z = map.getZoom();
    if (z < BALLOON_MIN_ZOOM) {
      if (markers.size) {
        layer.clearLayers();
        markers.clear();
      }
      return;
    }
    const b = map.getBounds();
    const visible = stakesInRect(
      {
        south: b.getSouth(),
        west: b.getWest(),
        north: b.getNorth(),
        east: b.getEast(),
      },
      40,
    );
    const skip = matchRef.current?.estaca ?? null;
    const keep = new Set<number>();
    for (const st of visible) {
      if (skip != null && st.number === skip) continue;
      keep.add(st.number);
      if (!markers.has(st.number)) {
        const marker = L.marker([st.pos.lat, st.pos.lng], {
          icon: iconFor(st.number),
          interactive: false,
          keyboard: false,
          zIndexOffset: 200,
        }).addTo(layer);
        markers.set(st.number, marker);
      }
    }
    for (const [n, marker] of markers) {
      if (!keep.has(n)) {
        layer.removeLayer(marker);
        markers.delete(n);
      }
    }
  };

  map.on("moveend", sync);
  map.on("zoomend", sync);
  map.whenReady(sync);
  const later = window.setTimeout(sync, 350);

  return () => {
    window.clearTimeout(later);
    map.off("moveend", sync);
    map.off("zoomend", sync);
    layer.remove();
    markers.clear();
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
      map.fire("moveend");
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
    } else {
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
    }
    map.fire("moveend");
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
