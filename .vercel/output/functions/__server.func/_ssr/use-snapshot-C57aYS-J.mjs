import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn, u as uid } from "./utils-C8V_sHGQ.mjs";
import { c as WORKS, l as buildDescription, n as EQUIPMENT, s as STREETS, t as ACTIVITIES } from "./description--QsXGJw3.mjs";
import { a as closeApontamento, c as getPresence, f as toggleStreet$1, i as addWork$1, l as getSnapshot, m as upsertApontamento, n as addEquipment$1, o as deleteApontamento, p as updateEquipment$1, r as addStreet$1, t as addActivity$1, u as pingPresence } from "./api-BJJ-G5gd.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-snapshot-C57aYS-J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			secondary: "bg-surface-2 text-fg hover:bg-border",
			outline: "border border-border bg-surface text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger text-primary-fg hover:bg-danger/90"
		},
		size: {
			default: "h-12 rounded-md px-4 text-base",
			sm: "h-9 rounded-sm px-3 text-sm",
			lg: "h-14 rounded-lg px-5 text-lg",
			icon: "size-12 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var DEFAULT_CENTER = {
	lat: -22.7524,
	lng: -42.8935
};
function haversineMeters(a, b) {
	const R = 6371e3;
	const dLat = (b.lat - a.lat) * Math.PI / 180;
	const dLng = (b.lng - a.lng) * Math.PI / 180;
	const la1 = a.lat * Math.PI / 180;
	const la2 = b.lat * Math.PI / 180;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function projectMercator(lat, lng, zoom) {
	const n = 2 ** zoom;
	const x = (lng + 180) / 360 * n;
	const latRad = lat * Math.PI / 180;
	return {
		x,
		y: (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n
	};
}
function gpsQuality(accuracy) {
	if (accuracy <= 10) return "excellent";
	if (accuracy <= 25) return "good";
	if (accuracy <= 50) return "fair";
	return "poor";
}
function gpsQualityLabel(quality) {
	switch (quality) {
		case "excellent": return "Precisão alta";
		case "good": return "Precisão boa";
		case "fair": return "Precisão razoável";
		case "poor": return "Precisão fraca — aguarde o GPS";
	}
}
function matchStreetByLabel(label, streets, workId) {
	const hay = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	const list = streets.filter((s) => s.active && (!workId || s.workId === workId));
	const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/^(rua|av\.?|avenida|travessa|tv\.?)\s+/i, "");
	return list.find((s) => hay.includes(norm(s.name))) ?? list.find((s) => {
		return norm(s.name).split(/\s+/).some((w) => w.length > 4 && hay.includes(w));
	});
}
var listeners = /* @__PURE__ */ new Set();
var watchId = null;
var stopTimer = null;
var current = { status: "idle" };
var GPS_OPTS = {
	enableHighAccuracy: true,
	maximumAge: 0,
	timeout: 25e3
};
function emit(next) {
	current = next;
	for (const l of listeners) l(next);
}
function normalizeAccuracy(raw) {
	if (!Number.isFinite(raw) || raw <= 0) return 45;
	return raw;
}
function headingOf(coords) {
	const h = coords.heading;
	return typeof h === "number" && Number.isFinite(h) ? h : null;
}
function acceptReading(prev, lat, lng, accuracy) {
	const now = Date.now();
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
	if (!prev) {
		if (accuracy > 5e3) return null;
		return {
			status: "ready",
			lat,
			lng,
			accuracy,
			quality: gpsQuality(accuracy),
			heading: null,
			updatedAt: now
		};
	}
	const moved = haversineMeters(prev, {
		lat,
		lng
	});
	const age = now - prev.updatedAt;
	const better = accuracy < prev.accuracy * .75;
	const similar = accuracy <= prev.accuracy * 1.35;
	if (accuracy > prev.accuracy * 1.8 && accuracy > 35 && prev.accuracy <= 40 && age < 2e4) return null;
	if (accuracy > 100 && prev.accuracy <= 35 && age < 25e3) return null;
	if (moved < 3.5 && !better && age < 8e3) return null;
	if (!better && !similar && moved < 25 && age < 12e3) return null;
	if (moved < 3.5 && better) return {
		...prev,
		accuracy,
		quality: gpsQuality(accuracy),
		updatedAt: now
	};
	let nextLat = lat;
	let nextLng = lng;
	if (moved < 25 && similar) {
		const alpha = Math.min(.7, Math.max(.25, prev.accuracy / (prev.accuracy + accuracy)));
		nextLat = prev.lat * (1 - alpha) + lat * alpha;
		nextLng = prev.lng * (1 - alpha) + lng * alpha;
	}
	return {
		status: "ready",
		lat: nextLat,
		lng: nextLng,
		accuracy: better ? accuracy : Math.min(prev.accuracy * 1.05, accuracy),
		quality: gpsQuality(better ? accuracy : Math.min(prev.accuracy, accuracy)),
		heading: null,
		updatedAt: now
	};
}
function onPosition(pos) {
	const lat = pos.coords.latitude;
	const lng = pos.coords.longitude;
	const accuracy = normalizeAccuracy(pos.coords.accuracy);
	const prev = current.status === "ready" ? current : null;
	const next = acceptReading(prev, lat, lng, accuracy);
	if (!next) return;
	next.heading = headingOf(pos.coords);
	if (prev && Math.abs(prev.lat - next.lat) < 1e-7 && Math.abs(prev.lng - next.lng) < 1e-7 && Math.abs(prev.accuracy - next.accuracy) < 1.5) return;
	emit(next);
}
function onError(err) {
	const denied = err.code === err.PERMISSION_DENIED;
	if (current.status === "ready" && !denied) return;
	emit({
		status: denied ? "denied" : "error",
		message: denied ? "Permita o acesso à localização nas configurações do aparelho." : err.message || "Não foi possível ler o GPS. Tente de novo ao ar livre."
	});
}
function startWatch() {
	if (typeof navigator === "undefined" || !navigator.geolocation) {
		emit({
			status: "unsupported",
			message: "Este aparelho não tem GPS."
		});
		return;
	}
	if (watchId != null) return;
	if (current.status !== "ready") emit({ status: "requesting" });
	navigator.geolocation.getCurrentPosition(onPosition, onError, GPS_OPTS);
	watchId = navigator.geolocation.watchPosition(onPosition, onError, GPS_OPTS);
}
function stopWatch() {
	if (watchId == null || typeof navigator === "undefined") return;
	navigator.geolocation.clearWatch(watchId);
	watchId = null;
}
function useGps() {
	const [state, setState] = (0, import_react.useState)(current);
	const retry = (0, import_react.useCallback)(() => {
		stopWatch();
		emit({ status: "requesting" });
		startWatch();
	}, []);
	(0, import_react.useEffect)(() => {
		listeners.add(setState);
		if (stopTimer != null) {
			window.clearTimeout(stopTimer);
			stopTimer = null;
		}
		startWatch();
		return () => {
			listeners.delete(setState);
			if (listeners.size === 0) stopTimer = window.setTimeout(() => {
				if (listeners.size === 0) stopWatch();
			}, 3e4);
		};
	}, []);
	return {
		...state,
		retry
	};
}
var DEVICE_KEY = "apontador-device-id";
var LABEL_KEY = "apontador-crew-label";
var LAST_KEY = "apontador-last";
function getDeviceId() {
	if (typeof localStorage === "undefined") return "preview";
	let id = localStorage.getItem(DEVICE_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(DEVICE_KEY, id);
	}
	return id;
}
function getCrewLabel() {
	if (typeof localStorage === "undefined") return "";
	return localStorage.getItem(LABEL_KEY) ?? "";
}
function setCrewLabel(label) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(LABEL_KEY, label.trim().slice(0, 24));
}
function loadLast() {
	const fallback = {
		workId: "l449",
		streetId: "",
		equipmentId: "",
		activityId: ""
	};
	if (typeof localStorage === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(LAST_KEY);
		if (raw) return JSON.parse(raw);
	} catch {}
	return fallback;
}
function saveLast(last) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(LAST_KEY, JSON.stringify(last));
}
var KEY = "l449.field-db.v1";
function emptyStore() {
	return {
		apontamentos: [],
		extra: {
			works: [],
			streets: [],
			equipment: [],
			activities: []
		},
		deletedIds: [],
		inactiveStreetIds: [],
		inactiveEquipmentIds: []
	};
}
function mergeById(base, extra) {
	const map = /* @__PURE__ */ new Map();
	for (const row of base) map.set(row.id, row);
	for (const row of extra) map.set(row.id, row);
	return [...map.values()];
}
function seedSnapshot() {
	return {
		works: WORKS,
		streets: STREETS,
		equipment: EQUIPMENT,
		activities: ACTIVITIES,
		apontamentos: [],
		presence: [],
		live: false
	};
}
function readStore() {
	if (typeof window === "undefined") return emptyStore();
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return emptyStore();
		const parsed = JSON.parse(raw);
		return {
			apontamentos: Array.isArray(parsed.apontamentos) ? parsed.apontamentos : [],
			extra: {
				works: parsed.extra?.works ?? [],
				streets: parsed.extra?.streets ?? [],
				equipment: parsed.extra?.equipment ?? [],
				activities: parsed.extra?.activities ?? []
			},
			deletedIds: parsed.deletedIds ?? [],
			inactiveStreetIds: parsed.inactiveStreetIds ?? [],
			inactiveEquipmentIds: parsed.inactiveEquipmentIds ?? []
		};
	} catch {
		return emptyStore();
	}
}
function writeStore(store) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(KEY, JSON.stringify(store));
}
function catalog(store) {
	return {
		works: mergeById(WORKS, store.extra.works),
		streets: mergeById(STREETS, store.extra.streets).map((s) => ({
			...s,
			active: store.inactiveStreetIds.includes(s.id) ? false : s.active
		})),
		equipment: mergeById(EQUIPMENT, store.extra.equipment).map((e) => ({
			...e,
			active: store.inactiveEquipmentIds.includes(e.id) ? false : e.active
		})),
		activities: mergeById(ACTIVITIES, store.extra.activities)
	};
}
function localSnapshot() {
	const store = readStore();
	const deleted = new Set(store.deletedIds);
	const { works, streets, equipment, activities } = catalog(store);
	return {
		works,
		streets,
		equipment,
		activities,
		apontamentos: store.apontamentos.filter((a) => !deleted.has(a.id)),
		presence: [],
		live: false
	};
}
function buildRow(data, snap) {
	const work = snap.works.find((w) => w.id === data.workId);
	const street = snap.streets.find((s) => s.id === data.streetId);
	const eq = snap.equipment.find((e) => e.id === data.equipmentId);
	const act = snap.activities.find((a) => a.id === data.activityId);
	const workName = work ? `${work.code} ${work.name}` : "";
	const streetName = street?.name ?? "";
	const equipmentName = eq?.name ?? "";
	const activityName = act?.name ?? "";
	const now = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: data.id,
		date: data.date,
		start: data.start,
		end: data.end,
		workId: data.workId,
		workName,
		streetId: data.streetId,
		streetName,
		equipmentId: data.equipmentId,
		equipmentName,
		equipmentKind: eq?.kind ?? "truck",
		activityId: data.activityId,
		activityName,
		estaca: data.estaca,
		pv: data.pv,
		quantity: data.quantity,
		notes: data.notes,
		description: buildDescription({
			equipmentName,
			activityName,
			streetName,
			estaca: data.estaca,
			pv: data.pv
		}),
		lat: data.lat,
		lng: data.lng,
		accuracy: data.accuracy,
		locationLabel: data.locationLabel,
		deviceId: data.deviceId,
		createdAt: now,
		updatedAt: now
	};
}
function upsertApontamentoLocal(data) {
	const store = readStore();
	const snap = localSnapshot();
	const existing = store.apontamentos.find((a) => a.id === data.id);
	let id = data.id;
	let start = data.start;
	if (!existing) {
		const open = store.apontamentos.find((a) => a.equipmentId === data.equipmentId && !a.end);
		if (open) {
			id = open.id;
			start = open.start;
		}
	}
	const row = buildRow({
		...data,
		id,
		start
	}, snap);
	if (existing) row.createdAt = existing.createdAt;
	store.apontamentos = [row, ...store.apontamentos.filter((a) => a.id !== row.id)];
	store.deletedIds = store.deletedIds.filter((x) => x !== row.id);
	writeStore(store);
	return row;
}
function closeApontamentoLocal(id, end) {
	const store = readStore();
	store.apontamentos = store.apontamentos.map((a) => a.id === id ? {
		...a,
		end,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : a);
	writeStore(store);
}
function deleteApontamentoLocal(id) {
	const store = readStore();
	store.apontamentos = store.apontamentos.filter((a) => a.id !== id);
	if (!store.deletedIds.includes(id)) store.deletedIds.push(id);
	writeStore(store);
}
function addWorkLocal(code, name) {
	const store = readStore();
	const id = uid();
	store.extra.works.push({
		id,
		code,
		name,
		active: true
	});
	writeStore(store);
	return { id };
}
function addStreetLocal(name, workId) {
	const store = readStore();
	const id = uid();
	store.extra.streets.push({
		id,
		name,
		workId,
		active: true
	});
	writeStore(store);
	return { id };
}
function addEquipmentLocal(input) {
	const store = readStore();
	const id = uid();
	store.extra.equipment.push({
		id,
		code: input.code,
		name: input.name,
		kind: input.kind,
		activityIds: input.activityIds,
		active: true
	});
	writeStore(store);
	return { id };
}
function updateEquipmentLocal(input) {
	const store = readStore();
	const { equipment } = catalog(store);
	const cur = equipment.find((e) => e.id === input.id);
	if (!cur) return { ok: false };
	const next = {
		...cur,
		name: input.name ?? cur.name,
		code: input.code ?? cur.code,
		kind: input.kind ?? cur.kind,
		activityIds: input.activityIds ?? cur.activityIds,
		active: input.active ?? cur.active
	};
	store.extra.equipment = mergeById(store.extra.equipment, [next]);
	if (next.active) store.inactiveEquipmentIds = store.inactiveEquipmentIds.filter((x) => x !== next.id);
	else if (!store.inactiveEquipmentIds.includes(next.id)) store.inactiveEquipmentIds.push(next.id);
	writeStore(store);
	return { ok: true };
}
function toggleStreetLocal(id) {
	const store = readStore();
	if (store.inactiveStreetIds.includes(id)) store.inactiveStreetIds = store.inactiveStreetIds.filter((x) => x !== id);
	else store.inactiveStreetIds.push(id);
	writeStore(store);
	return { ok: true };
}
function addActivityLocal(name, equipmentId) {
	const store = readStore();
	const id = uid();
	store.extra.activities.push({
		id,
		name,
		kind: "servico"
	});
	if (equipmentId) {
		const { equipment } = catalog(store);
		const cur = equipment.find((e) => e.id === equipmentId);
		if (cur) {
			const next = {
				...cur,
				activityIds: [...cur.activityIds, id]
			};
			store.extra.equipment = mergeById(store.extra.equipment, [next]);
		}
	}
	writeStore(store);
	return { id };
}
function mergeSnapshots(local, remote) {
	const store = readStore();
	const deleted = new Set(store.deletedIds);
	const remoteApts = remote.apontamentos.filter((a) => !deleted.has(a.id));
	const remoteIds = new Set(remoteApts.map((a) => a.id));
	const localOnly = local.apontamentos.filter((a) => !remoteIds.has(a.id) && !deleted.has(a.id));
	return {
		works: mergeById(remote.works, local.works),
		streets: mergeById(remote.streets, local.streets),
		equipment: mergeById(remote.equipment, local.equipment),
		activities: mergeById(remote.activities, local.activities),
		apontamentos: [...remoteApts, ...localOnly],
		presence: remote.presence,
		live: remote.live
	};
}
function persistMergedApontamentos(rows) {
	const store = readStore();
	store.apontamentos = rows;
	writeStore(store);
}
async function tryRemote(fn) {
	try {
		return await fn();
	} catch {
		return null;
	}
}
async function fetchSnapshot() {
	const local = typeof window === "undefined" ? seedSnapshot() : localSnapshot();
	const remote = await tryRemote(() => getSnapshot());
	if (!remote?.live) return {
		...local,
		live: false
	};
	const merged = mergeSnapshots(local, remote);
	persistMergedApontamentos(merged.apontamentos);
	return {
		...merged,
		live: true
	};
}
async function saveApontamento(data) {
	try {
		const remote = await upsertApontamento({ data });
		upsertApontamentoLocal(data);
		return remote;
	} catch {
		return upsertApontamentoLocal(data);
	}
}
async function endApontamento(id, end) {
	closeApontamentoLocal(id, end);
	await tryRemote(() => closeApontamento({ data: {
		id,
		end
	} }));
	return { ok: true };
}
async function removeApontamento(id) {
	deleteApontamentoLocal(id);
	await tryRemote(() => deleteApontamento({ data: { id } }));
	return { ok: true };
}
async function fetchPresence() {
	return await tryRemote(() => getPresence()) ?? [];
}
async function sendPresence(data) {
	await tryRemote(() => pingPresence({ data }));
}
async function addActivity(args) {
	const remote = await tryRemote(() => addActivity$1(args));
	if (remote) return remote;
	return addActivityLocal(args.data.name, args.data.equipmentId);
}
async function addWork(args) {
	const remote = await tryRemote(() => addWork$1(args));
	if (remote) return remote;
	return addWorkLocal(args.data.code, args.data.name);
}
async function addStreet(args) {
	const remote = await tryRemote(() => addStreet$1(args));
	if (remote) return remote;
	return addStreetLocal(args.data.name, args.data.workId);
}
async function addEquipment(args) {
	const remote = await tryRemote(() => addEquipment$1(args));
	if (remote) return remote;
	return addEquipmentLocal(args.data);
}
async function updateEquipment(args) {
	const remote = await tryRemote(() => updateEquipment$1(args));
	if (remote) return remote;
	return updateEquipmentLocal(args.data);
}
async function toggleStreet(args) {
	const remote = await tryRemote(() => toggleStreet$1(args));
	if (remote) return remote;
	return toggleStreetLocal(args.data.id);
}
var SNAPSHOT_KEY = ["snapshot"];
var PRESENCE_KEY = ["presence"];
function useSnapshot(_initial, live = false) {
	return useQuery({
		queryKey: SNAPSHOT_KEY,
		queryFn: () => fetchSnapshot(),
		staleTime: live ? 4e3 : 3e4,
		refetchOnWindowFocus: true,
		refetchInterval: live ? 5e3 : false,
		placeholderData: (prev) => prev ?? seedSnapshot()
	});
}
function useLivePresence(enabled, _initial) {
	return useQuery({
		queryKey: PRESENCE_KEY,
		queryFn: () => fetchPresence(),
		enabled,
		staleTime: 6e3,
		refetchInterval: enabled ? 8e3 : false,
		refetchOnWindowFocus: false,
		placeholderData: (prev) => prev ?? []
	});
}
function useInvalidateSnapshot() {
	const qc = useQueryClient();
	return () => {
		qc.invalidateQueries({ queryKey: SNAPSHOT_KEY });
		qc.invalidateQueries({ queryKey: PRESENCE_KEY });
	};
}
function useUpsertApontamento() {
	const invalidate = useInvalidateSnapshot();
	return useMutation({
		mutationFn: (data) => saveApontamento(data),
		onSuccess: () => void invalidate()
	});
}
function useCloseApontamento() {
	const invalidate = useInvalidateSnapshot();
	return useMutation({
		mutationFn: (data) => endApontamento(data.id, data.end),
		onSuccess: () => void invalidate()
	});
}
function useDeleteApontamento() {
	const invalidate = useInvalidateSnapshot();
	return useMutation({
		mutationFn: (id) => removeApontamento(id),
		onSuccess: () => void invalidate()
	});
}
function usePresencePing(gps, last) {
	const lat = gps.status === "ready" ? gps.lat : null;
	const lng = gps.status === "ready" ? gps.lng : null;
	const acc = gps.status === "ready" ? gps.accuracy : null;
	const lastSent = (0, import_react.useRef)({
		lat: 0,
		lng: 0,
		t: 0
	});
	(0, import_react.useEffect)(() => {
		if (lat == null || lng == null) return;
		const send = (force) => {
			const moved = haversineMeters({
				lat,
				lng
			}, lastSent.current);
			const age = Date.now() - lastSent.current.t;
			if (!force && moved < 8 && age < 12e3) return;
			lastSent.current = {
				lat,
				lng,
				t: Date.now()
			};
			sendPresence({
				deviceId: getDeviceId(),
				label: getCrewLabel() || "No campo",
				lat,
				lng,
				accuracy: acc,
				workId: last.workId || null,
				equipmentId: last.equipmentId || null,
				streetId: last.streetId || null,
				activityId: last.activityId || null,
				apontamentoId: last.apontamentoId || null
			});
		};
		send(false);
		const id = window.setInterval(() => send(true), 12e3);
		return () => window.clearInterval(id);
	}, [
		lat,
		lng,
		acc,
		last.workId,
		last.equipmentId,
		last.streetId,
		last.activityId,
		last.apontamentoId
	]);
}
//#endregion
export { usePresencePing as C, useLivePresence as S, useUpsertApontamento as T, updateEquipment as _, addStreet as a, useGps as b, getDeviceId as c, loadLast as d, matchStreetByLabel as f, toggleStreet as g, setCrewLabel as h, addEquipment as i, gpsQualityLabel as l, saveLast as m, DEFAULT_CENTER as n, addWork as o, projectMercator as p, addActivity as r, getCrewLabel as s, Button as t, haversineMeters as u, useCloseApontamento as v, useSnapshot as w, useInvalidateSnapshot as x, useDeleteApontamento as y };
