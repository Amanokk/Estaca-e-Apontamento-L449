import { u as haversineMeters } from "./use-snapshot-C57aYS-J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crew-BAt7bSVX.js
var ONLINE_MS = 45e3;
var STALE_MS = 48e4;
function nameOf(list, id) {
	if (!id) return "";
	return list.find((x) => x.id === id)?.name ?? "";
}
function buildCrew(opts) {
	const now = opts.now ?? Date.now();
	const open = opts.apontamentos.filter((a) => !a.end);
	const usedOpen = /* @__PURE__ */ new Set();
	const members = [];
	const selfGps = opts.gps.status === "ready" ? opts.gps : null;
	const openByDevice = /* @__PURE__ */ new Map();
	const openByEq = /* @__PURE__ */ new Map();
	for (const a of open) {
		if (a.deviceId) openByDevice.set(a.deviceId, a);
		openByEq.set(a.equipmentId, a);
	}
	function attach(p, forceSelf) {
		const a = (p.apontamentoId ? open.find((x) => x.id === p.apontamentoId) : void 0) ?? openByDevice.get(p.deviceId) ?? (p.equipmentId ? openByEq.get(p.equipmentId) : void 0);
		if (a) usedOpen.add(a.id);
		const age = now - new Date(p.updatedAt).getTime();
		const online = Number.isFinite(age) && age <= ONLINE_MS;
		const stale = !online && Number.isFinite(age) && age <= STALE_MS;
		const lat = p.lat;
		const lng = p.lng;
		return {
			id: p.deviceId,
			isSelf: forceSelf || p.deviceId === opts.deviceId,
			online,
			stale,
			label: p.label || (forceSelf ? "Você" : "No campo"),
			equipmentId: a?.equipmentId ?? p.equipmentId,
			equipmentName: a?.equipmentName || nameOf(opts.equipment, p.equipmentId),
			activityName: a?.activityName || nameOf(opts.activities, p.activityId),
			streetName: a?.streetName || nameOf(opts.streets, p.streetId),
			workName: a?.workName || nameOf(opts.works, p.workId),
			lat,
			lng,
			accuracy: p.accuracy,
			updatedAt: p.updatedAt,
			apontamentoId: a?.id ?? p.apontamentoId,
			distanceM: selfGps && p.deviceId !== opts.deviceId ? haversineMeters(selfGps, {
				lat,
				lng
			}) : null
		};
	}
	const seen = /* @__PURE__ */ new Set();
	for (const p of opts.presence) {
		seen.add(p.deviceId);
		members.push(attach(p, p.deviceId === opts.deviceId));
	}
	if (selfGps && !seen.has(opts.deviceId)) members.push(attach({
		deviceId: opts.deviceId,
		label: "Você",
		lat: selfGps.lat,
		lng: selfGps.lng,
		accuracy: selfGps.accuracy,
		workId: null,
		equipmentId: null,
		streetId: null,
		activityId: null,
		apontamentoId: null,
		updatedAt: new Date(selfGps.updatedAt).toISOString()
	}, true));
	for (const a of open) {
		if (usedOpen.has(a.id)) continue;
		if (a.deviceId && seen.has(a.deviceId)) continue;
		const id = a.deviceId || `apt-${a.id}`;
		const hasGeo = a.lat != null && a.lng != null;
		members.push({
			id,
			isSelf: a.deviceId === opts.deviceId,
			online: false,
			stale: true,
			label: a.equipmentName,
			equipmentId: a.equipmentId,
			equipmentName: a.equipmentName,
			activityName: a.activityName,
			streetName: a.streetName,
			workName: a.workName,
			lat: a.lat,
			lng: a.lng,
			accuracy: a.accuracy,
			updatedAt: a.updatedAt,
			apontamentoId: a.id,
			distanceM: selfGps && hasGeo ? haversineMeters(selfGps, {
				lat: a.lat,
				lng: a.lng
			}) : null
		});
	}
	return members.sort((a, b) => {
		if (a.isSelf !== b.isSelf) return a.isSelf ? -1 : 1;
		if (a.online !== b.online) return a.online ? -1 : 1;
		return b.updatedAt.localeCompare(a.updatedAt);
	});
}
function openForEquipment(rows, equipmentId) {
	if (!equipmentId) return void 0;
	return rows.find((a) => !a.end && a.equipmentId === equipmentId);
}
//#endregion
export { openForEquipment as n, buildCrew as t };
