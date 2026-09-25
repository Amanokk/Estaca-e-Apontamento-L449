import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BJJ-G5gd.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("8d42ed533f9e880af7d4b9c7f833591bfa25f76948cdffd848723661f020b3dc"));
var saveSchema = object({
	id: string().min(1),
	date: string().min(8),
	start: string().min(4),
	end: string().nullable(),
	workId: string(),
	streetId: string(),
	equipmentId: string(),
	activityId: string(),
	estaca: string(),
	pv: string(),
	quantity: number().nullable(),
	notes: string(),
	lat: number().nullable(),
	lng: number().nullable(),
	accuracy: number().nullable(),
	locationLabel: string(),
	deviceId: string()
});
var upsertApontamento = createServerFn({ method: "POST" }).validator(saveSchema).handler(createSsrRpc("ce847625bb57870d3161edb5b1541a32a2202cd294a7b5430ce2b1fde6de1c25"));
var closeApontamento = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	end: string()
})).handler(createSsrRpc("5c192a039b56d8e46a700abb17a5ffee18cbbf2d67bd0f12298a306bdd13d0e7"));
var deleteApontamento = createServerFn({ method: "POST" }).validator(object({ id: string() })).handler(createSsrRpc("c0663af8e30866edb8347b722afe0e997ea4d393f77a8ef50929d7c835316f64"));
var presenceSchema = object({
	deviceId: string().min(1),
	label: string(),
	lat: number(),
	lng: number(),
	accuracy: number().nullable(),
	workId: string().nullable(),
	equipmentId: string().nullable(),
	streetId: string().nullable(),
	activityId: string().nullable(),
	apontamentoId: string().nullable()
});
var pingPresence = createServerFn({ method: "POST" }).validator(presenceSchema).handler(createSsrRpc("eef9a9df9c5ee2b86cde8892389b36bf627bdf3a94ed759df0f5daccf6550719"));
var getPresence = createServerFn({ method: "GET" }).handler(createSsrRpc("00292b52dd7688df04a75490ecb496222dc0fa08d0395f0171ed923baec56cf8"));
var reverseGeocode = createServerFn({ method: "POST" }).validator(object({
	lat: number(),
	lng: number()
})).handler(createSsrRpc("9adbf68a15d15b1c3afe18f38f6440b0816972ca3405db633a16ff37230a28af"));
var addWork = createServerFn({ method: "POST" }).validator(object({
	code: string().min(1),
	name: string().min(1)
})).handler(createSsrRpc("bcb49d7dde462ae0dc5126adee0ca7fccca81b652363a307d1137dada119b28a"));
var addStreet = createServerFn({ method: "POST" }).validator(object({
	name: string().min(1),
	workId: string()
})).handler(createSsrRpc("9cff1b772483fd6081dbf3a0cabbcfdfb0caa742731a4ba634c078ffca059d09"));
var addEquipment = createServerFn({ method: "POST" }).validator(object({
	name: string().min(1),
	code: string().min(1),
	kind: _enum([
		"retro",
		"rolo",
		"basculante",
		"pipa",
		"van",
		"truck"
	]),
	activityIds: array(string())
})).handler(createSsrRpc("248ee50e388b9300d95f63360cb601a04b13b11dedadbe2c9f883c8601c0a51d"));
var updateEquipment = createServerFn({ method: "POST" }).validator(object({
	id: string(),
	name: string().optional(),
	code: string().optional(),
	kind: _enum([
		"retro",
		"rolo",
		"basculante",
		"pipa",
		"van",
		"truck"
	]).optional(),
	activityIds: array(string()).optional(),
	active: boolean().optional()
})).handler(createSsrRpc("3d1c7dda79a7fdc17ceaf7ce20ff72734e2352e3f10bb2afdbfade1555773006"));
var toggleStreet = createServerFn({ method: "POST" }).validator(object({ id: string() })).handler(createSsrRpc("1a2e2f9a5e6c0cc2b16ff18ef04730889735175557329211235f34cd2ae03aab"));
var addActivity = createServerFn({ method: "POST" }).validator(object({
	name: string().min(1),
	equipmentId: string().optional()
})).handler(createSsrRpc("572516a8071f85131a32827d9675f8cfa4007eecf89ca944dfe1c2fd25c2a9e9"));
var fetchMiniMap = createServerFn({ method: "GET" }).validator(object({
	lat: number(),
	lng: number()
})).handler(createSsrRpc("e3c7cbbbf583b241f8de81fbc678e2517381766c4ff76ebc547d10594be7db08"));
//#endregion
export { closeApontamento as a, getPresence as c, reverseGeocode as d, toggleStreet as f, addWork as i, getSnapshot as l, upsertApontamento as m, addEquipment as n, deleteApontamento as o, updateEquipment as p, addStreet as r, fetchMiniMap as s, addActivity as t, pingPresence as u };
