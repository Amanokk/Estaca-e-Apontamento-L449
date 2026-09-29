import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/geo";
import { haversine } from "@/lib/geo";
import { STREETS } from "@/data/streets";
import { stakesInRect } from "@/lib/stakeIndex";
import { getAllStakes } from "@/lib/stakePoints";
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

function stakeRadius(z: number) {
  if (z >= 19) return 2.6;
  if (z >= 17) return 2;
  if (z >= 15) return 1.35;
  return 0.9;
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
  const highlightRef = useRef<import("leaflet").Polyline | null>(null);
  const balloonRef = useRef<import("leaflet").Marker | null>(null);
  const userRef = useRef<import("leaflet").CircleMarker | null>(null);
  const accRef = useRef<import("leaflet").Circle | null>(null);
  const stakeLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const pinLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const lastCenterRef = useRef<LatLng | null>(null);
  const [ready, setReady] = useState(false);
  const followRef = useRef(follow);
  followRef.current = follow;
  const pinsRef = useRef(pins);
  pinsRef.current = pins;

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    let cancelled = false;

    void import("leaflet").then((mod) => {
      if (cancelled || !hostRef.current || mapRef.current) return;
      const L = mod.default;
      LRef.current = L;

      const map = L.map(hostRef.current, {
        center: [PROJECT_CENTER.lat, PROJECT_CENTER.lng],
        zoom: 18,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
        zoomAnimation: false,
        markerZoomAnimation: false,
        fadeAnimation: false,
      });
      L.control.zoom({ position: "bottomleft" }).addTo(map);
      requestAnimationFrame(() => map.invalidateSize());

      L.tileLayer(GOOGLE_HYBRID_TILES, {
        subdomains: ["0", "1", "2", "3"],
        maxZoom: 21,
        maxNativeZoom: 20,
        updateWhenIdle: true,
        keepBuffer: 1,
        attribution: "Google",
      }).addTo(map);

      for (const s of STREETS) {
        L.polyline(
          s.path.map((p) => [p.lat, p.lng] as [number, number]),
          { color: "#38bdf8", weight: 2, opacity: 0.45, interactive: false },
        ).addTo(map);
      }

      const canvas = L.canvas({ padding: 0.4 });
      const stakes = L.layerGroup().addTo(map);
      const r0 = stakeRadius(map.getZoom());
      for (const st of getAllStakes()) {
        L.circleMarker([st.pos.lat, st.pos.lng], {
          radius: r0,
          color: "transparent",
          weight: 0,
          fillColor: "#e2e8f0",
          fillOpacity: 0.55,
          interactive: false,
          renderer: canvas,
        }).addTo(stakes);
      }
      stakeLayerRef.current = stakes;
      pinLayerRef.current = L.layerGroup().addTo(map);
      const labels = L.layerGroup().addTo(map);

      const renderLabels = () => {
        labels.clearLayers();
        const z = map.getZoom();
        if (z < 16) return;
        const b = map.getBounds();
        const visible = stakesInRect(
          {
            south: b.getSouth(),
            west: b.getWest(),
            north: b.getNorth(),
            east: b.getEast(),
          },
          180,
        );
        const step = z >= 18 ? 1 : z >= 17 ? 2 : 4;
        for (let i = 0; i < visible.length; i += step) {
          const st = visible[i];
          L.marker([st.pos.lat, st.pos.lng], {
            icon: L.divIcon({
              className: "stake-chip",
              html: `<span class="stake-chip-inner">${st.number}</span>`,
              iconSize: [36, 16],
              iconAnchor: [18, 22],
            }),
            interactive: false,
            keyboard: false,
          }).addTo(labels);
        }
      };

      map.on("dragstart", () => onUserDrag());
      let labelTimer: number | null = null;
      const scheduleLabels = () => {
        if (labelTimer) window.clearTimeout(labelTimer);
        labelTimer = window.setTimeout(renderLabels, 80);
      };
      map.on("moveend", scheduleLabels);
      map.on("zoomend", () => {
        const r = stakeRadius(map.getZoom());
        stakes.eachLayer((layer) => {
          const c = layer as import("leaflet").CircleMarker;
          if (typeof c.setRadius === "function") c.setRadius(r);
        });
        scheduleLabels();
      });
      renderLabels();

      mapRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L || !position) return;
    if (!userRef.current) {
      userRef.current = L.circleMarker([position.lat, position.lng], {
        radius: 8,
        color: "#0f172a",
        weight: 2,
        fillColor: "#22d3ee",
        fillOpacity: 1,
        interactive: false,
      }).addTo(map);
      map.setView([position.lat, position.lng], map.getZoom());
      lastCenterRef.current = position;
    } else {
      userRef.current.setLatLng([position.lat, position.lng]);
      const last = lastCenterRef.current;
      if (followRef.current && (!last || haversine(last, position) > 18)) {
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
          opacity: 0.4,
          fillColor: "#22d3ee",
          fillOpacity: 0.12,
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
      highlightRef.current?.remove();
      highlightRef.current = null;
      balloonRef.current?.remove();
      balloonRef.current = null;
      return;
    }
    const path = match.street.path.map((p) => [p.lat, p.lng] as [number, number]);
    if (!highlightRef.current) {
      highlightRef.current = L.polyline(path, {
        color: "#f5c518",
        weight: 5,
        opacity: 1,
        interactive: false,
      }).addTo(map);
    } else {
      highlightRef.current.setLatLngs(path);
    }

    const text = `E-${match.estaca}`;
    const icon = L.divIcon({
      className: "stake-balloon",
      html: `<div class="stake-balloon-inner">${text}</div>`,
      iconSize: [56, 28],
      iconAnchor: [28, 30],
    });
    if (!balloonRef.current) {
      balloonRef.current = L.marker([match.snapped.lat, match.snapped.lng], {
        icon,
        interactive: false,
        zIndexOffset: 900,
      }).addTo(map);
    } else {
      balloonRef.current.setLatLng([match.snapped.lat, match.snapped.lng]);
      balloonRef.current.setIcon(icon);
    }
  }, [match, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    const layer = pinLayerRef.current;
    if (!map || !L || !layer || !ready) return;
    layer.clearLayers();
    for (const pin of pins) {
      const machine = pin.kind === "machine";
      const sub = pin.sub ? `<span>${esc(pin.sub)}</span>` : "";
      const icon = L.divIcon({
        className: machine ? "live-pin machine" : "live-pin crew",
        html: `<div class="live-pin-inner"><i></i><b>${esc(pin.label)}</b>${sub}</div>`,
        iconSize: [120, 36],
        iconAnchor: [16, 18],
      });
      L.marker([pin.lat, pin.lng], { icon, interactive: false, zIndexOffset: 700 }).addTo(layer);
    }
  }, [pins, ready]);

  useEffect(() => {
    if (!recenterNonce) return;
    const map = mapRef.current;
    if (!map || !position) return;
    map.panTo([position.lat, position.lng]);
    lastCenterRef.current = position;
  }, [recenterNonce, position]);

  return <div ref={hostRef} className="absolute inset-0 z-0 bg-bg" />;
}
