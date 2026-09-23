export const GOOGLE_MAPS_KEY = "AIzaSyBmvJph4LmrbtW7skeczzpBIyb9WWzFKo4";

/** Satellite imagery (no labels). */
export const GOOGLE_SAT_TILES =
  "https://mt{s}.google.com/vt/lyrs=s&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";

/** Roads + street names overlay on top of satellite. */
export const GOOGLE_LABELS_TILES =
  "https://mt{s}.google.com/vt/lyrs=h&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";

/** Hybrid fallback (satellite + labels in one layer). */
export const GOOGLE_HYBRID_TILES =
  "https://mt{s}.google.com/vt/lyrs=y&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";

export function googleStaticMapUrl(lat: number, lng: number, size = 320) {
  const s = Math.max(120, Math.min(640, Math.round(size)));
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=${s}x${s}&scale=2&maptype=hybrid&language=pt-BR&region=BR&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;
}

export function loadGoogleStaticMap(lat: number, lng: number, size = 320): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("static map"));
    img.src = googleStaticMapUrl(lat, lng, size);
  });
}
