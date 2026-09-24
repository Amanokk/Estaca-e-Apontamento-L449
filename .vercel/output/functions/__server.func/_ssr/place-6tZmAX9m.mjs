import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { m as reverseGeocode } from "./use-snapshot-DQd27t-P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/place-6tZmAX9m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var cache = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
function placeKey(lat, lng) {
	return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}
function lookupPlace(lat, lng) {
	const key = placeKey(lat, lng);
	const hit = cache.get(key);
	if (hit) return Promise.resolve(hit);
	let pending = inflight.get(key);
	if (!pending) {
		pending = reverseGeocode({ data: {
			lat,
			lng
		} }).then((r) => {
			cache.set(key, r);
			inflight.delete(key);
			return r;
		}).catch(() => {
			inflight.delete(key);
			return {
				label: "",
				road: "",
				city: ""
			};
		});
		inflight.set(key, pending);
	}
	return pending;
}
function usePlaceLabel(lat, lng) {
	const [place, setPlace] = (0, import_react.useState)({
		label: "",
		road: "",
		city: ""
	});
	(0, import_react.useEffect)(() => {
		if (lat == null || lng == null) return;
		let cancelled = false;
		lookupPlace(lat, lng).then((r) => {
			if (!cancelled) setPlace(r);
		});
		return () => {
			cancelled = true;
		};
	}, [lat, lng]);
	return place;
}
//#endregion
export { usePlaceLabel as t };
