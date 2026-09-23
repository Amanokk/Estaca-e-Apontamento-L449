import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as require_piexif } from "../_libs/piexifjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MiniMapThumb-BlQA3Jbp.js
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
var GOOGLE_MAPS_KEY = "AIzaSyBmvJph4LmrbtW7skeczzpBIyb9WWzFKo4";
/** Satellite imagery (no labels). */
var GOOGLE_SAT_TILES = "https://mt{s}.google.com/vt/lyrs=s&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";
/** Roads + street names overlay on top of satellite. */
var GOOGLE_LABELS_TILES = "https://mt{s}.google.com/vt/lyrs=h&hl=pt-BR&gl=BR&x={x}&y={y}&z={z}";
function googleStaticMapUrl(lat, lng, size = 320) {
	const s = Math.max(120, Math.min(640, Math.round(size)));
	return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=${s}x${s}&scale=2&maptype=hybrid&language=pt-BR&region=BR&markers=color:red%7C${lat},${lng}&key=${GOOGLE_MAPS_KEY}`;
}
function loadGoogleStaticMap(lat, lng, size = 320) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("static map"));
		img.src = googleStaticMapUrl(lat, lng, size);
	});
}
function MiniMapThumb({ center, className, style, size = 160 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: googleStaticMapUrl(center.lat, center.lng, size),
		alt: "Mapa da localização",
		width: size,
		height: size,
		className,
		style,
		decoding: "async"
	});
}
//#endregion
export { deletePhoto as a, loadGoogleStaticMap as c, savePhoto as d, sharePhoto as f, addExif as i, putPhoto as l, GOOGLE_SAT_TILES as n, downloadDataUrl as o, useOnlineStatus as p, MiniMapThumb as r, listPhotos as s, GOOGLE_LABELS_TILES as t, retouchEstaca as u };
