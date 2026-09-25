//#region node_modules/.nitro/vite/services/ssr/assets/googleMaps-CypfyYWU.js
/** Hybrid: satellite + street names in a single layer (less lag than sat+labels). */
var GOOGLE_HYBRID_TILES = "https://mt{s}.google.com/vt/lyrs=y&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";
function googleHybridTileUrl(x, y, z, s = 0) {
	const n = 2 ** z;
	const wrap = (x % n + n) % n;
	return `https://mt${s % 4}.google.com/vt/lyrs=y&hl=pt-BR&gl=BR&x=${wrap}&y=${y}&z=${z}`;
}
function latLngToTile(lat, lng, z) {
	const n = 2 ** z;
	const x = (lng + 180) / 360 * n;
	const latRad = lat * Math.PI / 180;
	return {
		x,
		y: (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n
	};
}
//#endregion
export { googleHybridTileUrl as n, latLngToTile as r, GOOGLE_HYBRID_TILES as t };
