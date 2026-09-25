import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C8V_sHGQ.mjs";
import { n as googleHybridTileUrl, r as latLngToTile } from "./googleMaps-CypfyYWU.mjs";
import { t as require_piexif } from "../_libs/piexifjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MiniMapThumb-Crw4FNrw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_piexif = /* @__PURE__ */ __toESM(require_piexif());
var DB = "estacagps";
var STORE = "photos";
function open() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function tx(mode, fn) {
	return open().then((db) => new Promise((resolve, reject) => {
		const req = fn(db.transaction(STORE, mode).objectStore(STORE));
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	}));
}
async function putPhoto(p) {
	try {
		await tx("readwrite", (s) => s.put(p));
	} catch {}
}
async function listPhotos() {
	try {
		return (await tx("readonly", (s) => s.getAll())).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
	} catch {
		return [];
	}
}
async function deletePhoto(id) {
	try {
		await tx("readwrite", (s) => s.delete(id));
	} catch {}
}
function retouchEstaca(photo, novaEstaca) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) return reject(/* @__PURE__ */ new Error("Canvas indisponível"));
			ctx.drawImage(img, 0, 0);
			const box = photo.box ?? {
				x: Math.round(canvas.width * .015),
				y: Math.round(canvas.width * .015),
				w: Math.round(canvas.width * .25),
				h: Math.round(canvas.width * .0475),
				fontSize: Math.round(canvas.width * .035)
			};
			const text = novaEstaca || "Sem estaca";
			ctx.font = `800 ${box.fontSize}px "IBM Plex Sans", system-ui, sans-serif`;
			const padX = box.fontSize * .43;
			const newW = ctx.measureText(text).width + padX * 2;
			ctx.fillStyle = "#0f172a";
			ctx.fillRect(box.x, box.y, Math.max(box.w, newW), box.h);
			ctx.fillStyle = "#f5c518";
			ctx.textBaseline = "middle";
			ctx.fillText(text, box.x + padX, box.y + box.h / 2);
			resolve(canvas.toDataURL("image/jpeg", .92));
		};
		img.onerror = () => reject(/* @__PURE__ */ new Error("Falha ao carregar a foto"));
		img.src = photo.stamped;
	});
}
function sanitize(name) {
	return (name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-") || "foto").slice(0, 60);
}
function downloadDataUrl(dataUrl, fileName) {
	const name = fileName.toLowerCase().endsWith(".jpg") ? fileName : `${sanitize(fileName)}.jpg`;
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = name;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
}
async function dataUrlToFile(dataUrl, name) {
	const blob = await (await fetch(dataUrl)).blob();
	return new File([blob], name, { type: "image/jpeg" });
}
async function savePhoto(dataUrl, fileName) {
	downloadDataUrl(dataUrl, fileName);
	return {
		ok: true,
		message: `Baixado como ${sanitize(fileName)}.jpg`
	};
}
async function sharePhoto(dataUrl, fileName, text) {
	const name = `${sanitize(fileName)}.jpg`;
	try {
		const file = await dataUrlToFile(dataUrl, name);
		const nav = navigator;
		if (nav.share && nav.canShare?.({ files: [file] })) {
			await nav.share({
				files: [file],
				title: name,
				text
			});
			return {
				ok: true,
				message: "Compartilhado."
			};
		}
		downloadDataUrl(dataUrl, fileName);
		return {
			ok: true,
			message: `Baixado como ${name}`
		};
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return {
			ok: false,
			message: "Compartilhamento cancelado."
		};
		return {
			ok: false,
			message: e instanceof Error ? e.message : "Falha ao compartilhar."
		};
	}
}
function toDms(value) {
	const abs = Math.abs(value);
	const deg = Math.floor(abs);
	const minFloat = (abs - deg) * 60;
	const min = Math.floor(minFloat);
	const sec = Math.round((minFloat - min) * 60 * 1e4);
	return [
		[deg, 1],
		[min, 1],
		[sec, 1e4]
	];
}
function fmt(d) {
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}:${p(d.getMonth() + 1)}:${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function addExif(dataUrl, stamp) {
	try {
		const description = [stamp.estaca, stamp.street].filter(Boolean).join(" · ");
		const zeroth = {
			[import_piexif.default.ImageIFD.Make]: "EstacaGPS",
			[import_piexif.default.ImageIFD.Software]: "EstacaGPS by Vitor Lucas",
			[import_piexif.default.ImageIFD.Orientation]: 1,
			[import_piexif.default.ImageIFD.DateTime]: fmt(stamp.date)
		};
		if (description) zeroth[import_piexif.default.ImageIFD.ImageDescription] = description;
		const exif = {
			[import_piexif.default.ExifIFD.DateTimeOriginal]: fmt(stamp.date),
			[import_piexif.default.ExifIFD.DateTimeDigitized]: fmt(stamp.date),
			[import_piexif.default.ExifIFD.UserComment]: `ASCII\0\0\0${JSON.stringify({
				estaca: stamp.estaca,
				rua: stamp.street,
				lat: stamp.lat,
				lng: stamp.lng,
				timestamp: stamp.date.toISOString()
			})}`
		};
		const gps = {};
		if (stamp.lat !== null && stamp.lng !== null) {
			gps[import_piexif.default.GPSIFD.GPSLatitudeRef] = stamp.lat >= 0 ? "N" : "S";
			gps[import_piexif.default.GPSIFD.GPSLatitude] = toDms(stamp.lat);
			gps[import_piexif.default.GPSIFD.GPSLongitudeRef] = stamp.lng >= 0 ? "E" : "W";
			gps[import_piexif.default.GPSIFD.GPSLongitude] = toDms(stamp.lng);
			gps[import_piexif.default.GPSIFD.GPSDateStamp] = fmt(stamp.date).split(" ")[0];
		}
		const bytes = import_piexif.default.dump({
			"0th": zeroth,
			Exif: exif,
			GPS: gps
		});
		return import_piexif.default.insert(bytes, dataUrl);
	} catch {
		return dataUrl;
	}
}
function useOnlineStatus() {
	const [online, setOnline] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (typeof navigator === "undefined") return;
		const update = () => setOnline(navigator.onLine);
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
		return () => {
			window.removeEventListener("online", update);
			window.removeEventListener("offline", update);
		};
	}, []);
	return online;
}
var TILE = 256;
var Z = 18;
function MiniMapThumb({ center, className, style, size = 160 }) {
	const { x, y } = latLngToTile(center.lat, center.lng, Z);
	const tx = Math.floor(x);
	const ty = Math.floor(y);
	const fracX = x - tx;
	const fracY = y - ty;
	const scale = size / TILE;
	const originX = size / 2 - (1 + fracX) * TILE * scale;
	const originY = size / 2 - (1 + fracY) * TILE * scale;
	const tiles = [];
	for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) tiles.push({
		dx,
		dy
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden bg-subtle", className),
		style: {
			width: size,
			height: size,
			...style
		},
		"aria-label": "Mapa da localização",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute",
			style: {
				width: TILE * 3 * scale,
				height: TILE * 3 * scale,
				left: originX,
				top: originY
			},
			children: tiles.map(({ dx, dy }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: googleHybridTileUrl(tx + dx, ty + dy, Z, Math.abs(dx + dy) % 4),
				alt: "",
				width: TILE * scale,
				height: TILE * scale,
				draggable: false,
				className: "absolute",
				style: {
					left: (dx + 1) * TILE * scale,
					top: (dy + 1) * TILE * scale,
					width: TILE * scale,
					height: TILE * scale
				}
			}, `${dx}:${dy}`))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gps ring-2 ring-fg" })]
	});
}
//#endregion
export { listPhotos as a, savePhoto as c, downloadDataUrl as i, sharePhoto as l, addExif as n, putPhoto as o, deletePhoto as r, retouchEstaca as s, MiniMapThumb as t, useOnlineStatus as u };
