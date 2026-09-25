import { googleHybridTileUrl, latLngToTile } from "@/lib/googleMaps";
import type { LatLng } from "@/lib/geo";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const TILE = 256;
const Z = 18;

export function MiniMapThumb({
  center,
  className,
  style,
  size = 160,
}: {
  center: LatLng;
  className?: string;
  style?: CSSProperties;
  size?: number;
}) {
  const { x, y } = latLngToTile(center.lat, center.lng, Z);
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  const fracX = x - tx;
  const fracY = y - ty;
  const scale = size / TILE;
  const originX = size / 2 - (1 + fracX) * TILE * scale;
  const originY = size / 2 - (1 + fracY) * TILE * scale;
  const tiles: { dx: number; dy: number }[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) tiles.push({ dx, dy });
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-subtle", className)}
      style={{ width: size, height: size, ...style }}
      aria-label="Mapa da localização"
    >
      <div
        className="absolute"
        style={{
          width: TILE * 3 * scale,
          height: TILE * 3 * scale,
          left: originX,
          top: originY,
        }}
      >
        {tiles.map(({ dx, dy }) => (
          <img
            key={`${dx}:${dy}`}
            src={googleHybridTileUrl(tx + dx, ty + dy, Z, Math.abs(dx + dy) % 4)}
            alt=""
            width={TILE * scale}
            height={TILE * scale}
            draggable={false}
            className="absolute"
            style={{
              left: (dx + 1) * TILE * scale,
              top: (dy + 1) * TILE * scale,
              width: TILE * scale,
              height: TILE * scale,
            }}
          />
        ))}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gps ring-2 ring-fg" />
    </div>
  );
}
