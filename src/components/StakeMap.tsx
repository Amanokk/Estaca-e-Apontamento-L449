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

type LL = typeof import("leaflet");

function attachVisibleBalloons(L: LL, map: import("leaflet").Map) {
  const group = L.layerGroup().addTo(map);
  const markers = new Map<string, import("leaflet").Marker>();
  const icons = new Map<number, import("leaflet").DivIcon>();
  const iconFor = (n: number) => {
    let icon = icons.get(n);
    if (!icon) {
      icon = L.divIcon({
        className: "stake-chip",
        html: `<span class="stake-chip-inner" style="display:block;background:#f5c518;color:#0f172a;font:800 11px/1.15 ui-sans-serif,system-ui,sans-serif;padding:3px 6px;border-radius:4px;border:1px solid #0f172a;box-shadow:0 1px 4px rgba(0,0,0,.45);white-space:nowrap;text-align:center">${n}</span>`,
        iconSize: [36, 18],
        iconAnchor: [18, 18],
      });
      icons.set(n, icon);
    }
    return icon;
  };

  const stakeId = (street: string, n: number, lat: number, lng: number) =>
    `${street}:${n}:${lat.toFixed(6)}:${lng.toFixed(6)}`;

  const sync = () => {
    const size = map.getSize();
    const z = map.getZoom();
    if (size.x < 40 || size.y < 40 || z < 16) {
      if (markers.size) {
        group.clearLayers();
        markers.clear();
      }
      return;
    }
    const b = map.getBounds();
    let visible = stakesInRect(
      {
        south: b.getSouth(),
        west: b.getWest(),
        north: b.getNorth(),
        east: b.getEast(),
      },
      48,
    );
    if (visible.length > 24) {
      const c = map.getCenter();
      visible = visible
        .map((st) => ({
          st,
          d: Math.abs(st.pos.lat - c.lat) + Math.abs(st.pos.lng - c.lng),
        }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 24)
        .map((x) => x.st);
    }
    const keep = new Set<string>();
    for (const st of visible) {
      const id = stakeId(st.street.name, st.number, st.pos.lat, st.pos.lng);
      keep.add(id);
      if (markers.has(id)) continue;
      const marker = L.marker([st.pos.lat, st.pos.lng], {
        icon: iconFor(st.number),
        interactive: false,
        keyboard: false,
        zIndexOffset: 200,
      }).addTo(group);
      markers.set(id, marker);
    }
    for (const [id, marker] of markers) {
      if (keep.has(id)) continue;
      group.removeLayer(marker);
      markers.delete(id);
    }
  };

  map.on("moveend", sync);
  map.on("zoomend", sync);
  map.on("resize", sync);
  map.whenReady(() => {
    map.invalidateSize();
    sync();
  });
  const t1 = window.setTimeout(sync, 250);
  const t2 = window.setTimeout(sync, 900);

  return () => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
    map.off("moveend", sync);
    map.off("zoomend", sync);
    map.off("resize", sync);
    group.remove();
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
      detach = attachVisibleBalloons(L, map);
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
