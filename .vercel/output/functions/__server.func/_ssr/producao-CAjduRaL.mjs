import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { A as ClipboardList, E as Droplets, F as Check, I as ChartColumn, M as ChevronRight, N as ChevronLeft, O as Copy, P as ChevronDown, R as CalendarDays, _ as MessageSquareText, d as Route, j as ChevronUp, m as Plus, o as Trash2, r as X } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-BZnUg0Tg.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/producao-CAjduRaL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_STREETS = [
	"Visconde de Itaboraí",
	"João Caetano",
	"José Leandro",
	"Prefeito Augusto de Andrade",
	"Alberto Torres",
	"Ângelo Buriches",
	"Barão de Itapacorá"
];
var ACTIVITY_META = {
	ramal: {
		label: "Ramal",
		short: "Ramal",
		discipline: "drenagem"
	},
	caixa_ralo: {
		label: "Caixa ralo",
		short: "Caixa ralo",
		discipline: "drenagem"
	},
	alteamento: {
		label: "Alteamento de tampa",
		short: "Alteamento",
		discipline: "drenagem"
	},
	demolicao_calcada: {
		label: "Demolição de calçada",
		short: "Demolição",
		discipline: "pavimentacao"
	},
	solo: {
		label: "Troca de solo borrachudo",
		short: "Solo borrachudo",
		discipline: "pavimentacao"
	},
	regularizacao: {
		label: "Regularização de sub leito",
		short: "Sub leito",
		discipline: "pavimentacao"
	},
	enchimento_caixa: {
		label: "Enchimento de caixa de rua",
		short: "Caixa de rua",
		discipline: "pavimentacao"
	},
	enchimento_subbase: {
		label: "Enchimento de sub base",
		short: "Ench. sub base",
		discipline: "pavimentacao"
	},
	sub_base: {
		label: "Execução de sub base",
		short: "Sub base",
		discipline: "pavimentacao"
	},
	base: {
		label: "Execução de base",
		short: "Base",
		discipline: "pavimentacao"
	},
	meio_fio: {
		label: "Concretagem de meio fio",
		short: "Meio fio",
		discipline: "pavimentacao"
	},
	preparo_calcada: {
		label: "Preparo de calçada",
		short: "Preparo calçada",
		discipline: "pavimentacao"
	},
	concretagem_calcada: {
		label: "Concretagem de calçada",
		short: "Calçada",
		discipline: "pavimentacao"
	},
	cbuq: {
		label: "Aplicação de CBUQ",
		short: "CBUQ",
		discipline: "pavimentacao"
	},
	piso_tatil: {
		label: "Piso tátil",
		short: "Piso tátil",
		discipline: "pavimentacao"
	}
};
var PAVING_ORDER = [
	"demolicao_calcada",
	"solo",
	"regularizacao",
	"enchimento_caixa",
	"enchimento_subbase",
	"sub_base",
	"base",
	"meio_fio",
	"preparo_calcada",
	"concretagem_calcada",
	"cbuq",
	"piso_tatil"
];
var DRAIN_KINDS = [
	"ramal",
	"caixa_ralo",
	"alteamento"
];
var OBS_CHIPS = [
	"Produção afetada por conta de tempo chuvoso",
	"Produção afetada por conta de solo saturado devido chuva",
	"Produção afetada por conta de solo saturado devido chuva do dia anterior",
	"Produção afetada por conta de solo saturado devido chuva do fim de semana",
	"Produção afetada — patrol quebrou"
];
var RECADO_CHIPS = [
	"Falta de bica na obra",
	"Usina sem concreto",
	"Pá carregadeira da usina de concreto quebrou, por esse motivo não teve concreto",
	"Pedreira não está trazendo bica"
];
function appendNote(current, sentence) {
	const c = current.trim();
	if (!c) return sentence;
	if (c.includes(sentence)) return c;
	return `${c}${/[.!?]$/.test(c) ? " " : ". "}${sentence}`;
}
function parseQty(raw) {
	const t = raw.trim().replace(/\s/g, "").replace(",", ".");
	if (!t || t === ".") return 0;
	const n = Number(t);
	if (!Number.isFinite(n) || n < 0) return 0;
	return Math.round(n * 100) / 100;
}
function fmtNum(n) {
	return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}
var SHORT = [
	"dom",
	"seg",
	"ter",
	"qua",
	"qui",
	"sex",
	"sáb"
];
var LONG = [
	"domingo",
	"segunda",
	"terça",
	"quarta",
	"quinta",
	"sexta",
	"sábado"
];
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return (/* @__PURE__ */ new Date(d.getTime() - d.getTimezoneOffset() * 6e4)).toISOString().slice(0, 10);
}
function shiftISO(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(y, m - 1, d);
	dt.setDate(dt.getDate() + days);
	const mm = String(dt.getMonth() + 1).padStart(2, "0");
	const dd = String(dt.getDate()).padStart(2, "0");
	return `${dt.getFullYear()}-${mm}-${dd}`;
}
function formatBR(iso, withYear = false) {
	const [y, m, d] = iso.split("-");
	if (!d || !m) return iso;
	return withYear ? `${d}/${m}/${y}` : `${d}/${m}`;
}
function weekday(iso, long = false) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(y, (m || 1) - 1, d || 1);
	return (long ? LONG : SHORT)[dt.getDay()] ?? "";
}
function streetName(street) {
	return street.trim().replace(/\s+/g, " ").replace(/^rua\s+/i, "");
}
function streetKey(street) {
	return streetName(street).toLocaleLowerCase("pt-BR");
}
var VIS = "Visconde de Itaboraí";
var JOA = "João Caetano";
var JOS = "José Leandro";
var PRE = "Prefeito Augusto de Andrade";
var ALB = "Alberto Torres";
var ANG = "Ângelo Buriches";
var BAR = "Barão de Itapacorá";
function pv(id, code, qty, tubos = 0, pro = 0, aneis = 0) {
	return {
		id,
		code,
		qty,
		tubos,
		prolongadores: pro,
		aneis
	};
}
function dren(id, kind, street, pvs) {
	return {
		id,
		kind,
		street,
		qty: 0,
		pvs,
		rampas: 0,
		soloUnit: "m3"
	};
}
function pav(id, kind, street, qty, extra = {}) {
	return {
		id,
		kind,
		street,
		qty,
		pvs: [],
		rampas: extra.rampas ?? 0,
		soloUnit: extra.soloUnit ?? "m3",
		approx: kind === "cbuq" ? extra.approx !== false : extra.approx,
		semMetalon: extra.semMetalon,
		existente: extra.existente,
		soloPv: extra.soloPv
	};
}
function front(id, discipline, lines) {
	return {
		id,
		discipline,
		lines
	};
}
function day(date, fronts, obs = "", recado = "") {
	return {
		date,
		fronts,
		obs,
		recado,
		customText: null
	};
}
function seedDays() {
	const list = [
		day("2026-08-10", [
			front("d1008-1", "drenagem", [dren("d1008-1a", "ramal", VIS, [pv("d1008-p1", "PV D11", 1, 3), pv("d1008-p2", "PV D12", 1, 2)])]),
			front("d1008-2", "drenagem", [dren("d1008-2a", "caixa_ralo", JOA, [
				pv("d1008-p3", "PV C34", 1, 0, 2),
				pv("d1008-p4", "PV C36", 1, 0, 3),
				pv("d1008-p5", "PV C37", 1)
			])]),
			front("d1008-3", "drenagem", [dren("d1008-3a", "alteamento", JOA, [
				pv("d1008-p6", "PV C35", 1, 0, 0, 3),
				pv("d1008-p7", "PV C36", 1, 0, 0, 3),
				pv("d1008-p8", "PV C37", 1, 0, 0, 3),
				pv("d1008-p9", "PV C38", 1, 0, 0, 2)
			])]),
			front("d1008-4", "pavimentacao", [
				pav("d1008-4a", "regularizacao", VIS, 270),
				pav("d1008-4b", "sub_base", VIS, 180),
				pav("d1008-4c", "meio_fio", JOA, 70)
			]),
			front("d1008-5", "pavimentacao", [pav("d1008-5a", "preparo_calcada", JOS, 70), pav("d1008-5b", "concretagem_calcada", JOS, 60)])
		], "", "Dia 10/08 tempo chuvoso — 2 carros de concreto na parte da manhã, usina sem concreto depois do almoço."),
		day("2026-08-11", [], "", "Dia chuvoso — usina sem concreto até as 11h. Falta de bica na obra, pedreira não está trazendo bica."),
		day("2026-08-12", [
			front("d1208-1", "drenagem", [dren("d1208-1a", "ramal", VIS, [
				pv("d1208-p1", "PV D12", 1, 2),
				pv("d1208-p2", "PV D13", 2, 5),
				pv("d1208-p3", "PV D14", 2, 5)
			])]),
			front("d1208-2", "drenagem", [dren("d1208-2a", "caixa_ralo", JOA, [
				pv("d1208-p4", "PV C34", 1, 0, 2),
				pv("d1208-p5", "PV C35", 2, 2, 2),
				pv("d1208-p6", "PV C36", 1, 0, 2),
				pv("d1208-p7", "PV C37", 1, 0, 1),
				pv("d1208-p8", "PV C38", 2, 1, 3)
			])]),
			front("d1208-3", "pavimentacao", [pav("d1208-3a", "regularizacao", PRE, 90)]),
			front("d1208-4", "pavimentacao", [pav("d1208-4a", "regularizacao", VIS, 180), pav("d1208-4b", "sub_base", VIS, 250)])
		], "Produção afetada por conta de tempo chuvoso", "Continua a falta de bica na obra, mesmo chegando alguns carros."),
		day("2026-08-13", [
			front("d1308-1", "drenagem", [dren("d1308-1a", "caixa_ralo", VIS, [pv("d1308-p1", "PV D1", 2, 0, 2), pv("d1308-p2", "PV D2", 3, 0, 4)])]),
			front("d1308-2", "drenagem", [dren("d1308-2a", "alteamento", JOA, [pv("d1308-p3", "PV C32", 1), pv("d1308-p4", "PV C33", 1)])]),
			front("d1308-3", "pavimentacao", [
				pav("d1308-3a", "sub_base", VIS, 90),
				pav("d1308-3b", "meio_fio", VIS, 148),
				pav("d1308-3c", "enchimento_caixa", JOA, 90),
				pav("d1308-3d", "base", JOA, 130)
			]),
			front("d1308-4", "pavimentacao", [pav("d1308-4a", "concretagem_calcada", JOS, 65)])
		]),
		day("2026-08-14", [
			front("d1408-1", "drenagem", [dren("d1408-1a", "alteamento", JOA, [
				pv("d1408-p1", "PV C34", 1),
				pv("d1408-p2", "PV C35", 1),
				pv("d1408-p3", "PV C36", 1),
				pv("d1408-p4", "PV C37", 1),
				pv("d1408-p5", "PV C38", 1),
				pv("d1408-p6", "PV C39", 1),
				pv("d1408-p7", "PV C40", 1)
			])]),
			front("d1408-2", "pavimentacao", [pav("d1408-2a", "base", JOA, 140), pav("d1408-2b", "sub_base", VIS, 82)]),
			front("d1408-3", "pavimentacao", [pav("d1408-3a", "preparo_calcada", JOS, 110)]),
			front("d1408-4", "pavimentacao", [pav("d1408-4a", "cbuq", JOA, 230)])
		]),
		day("2026-08-17", [front("d1708-1", "pavimentacao", [
			pav("d1708-1a", "regularizacao", VIS, 120),
			pav("d1708-1b", "sub_base", VIS, 130),
			pav("d1708-1c", "meio_fio", VIS, 148)
		]), front("d1708-2", "pavimentacao", [pav("d1708-2a", "preparo_calcada", JOS, 180, { semMetalon: true })])], "Produção afetada por conta de solo saturado devido chuva do fim de semana"),
		day("2026-08-18", [
			front("d1808-1", "drenagem", [dren("d1808-1a", "caixa_ralo", VIS, [
				pv("d1808-p1", "PV D2", 1, 1, 1),
				pv("d1808-p2", "PV D4", 2, 0, 2),
				pv("d1808-p3", "PV D13", 1)
			])]),
			front("d1808-2", "pavimentacao", [
				pav("d1808-2a", "demolicao_calcada", VIS, 100),
				pav("d1808-2b", "regularizacao", VIS, 150),
				pav("d1808-2c", "sub_base", VIS, 140),
				pav("d1808-2d", "meio_fio", VIS, 75)
			]),
			front("d1808-3", "pavimentacao", [pav("d1808-3a", "preparo_calcada", JOS, 175, { semMetalon: true }), pav("d1808-3b", "concretagem_calcada", JOS, 62)])
		]),
		day("2026-08-19", [front("d1908-1", "drenagem", [dren("d1908-1a", "caixa_ralo", VIS, [
			pv("d1908-p1", "PV D3", 1, 0, 1),
			pv("d1908-p2", "PV D5", 3, 0, 2),
			pv("d1908-p3", "PV D6", 2, 0, 1),
			pv("d1908-p4", "PV D7", 2),
			pv("d1908-p5", "PV D8", 2),
			pv("d1908-p6", "PV D9", 1, 0, 1),
			pv("d1908-p7", "PV D10", 1)
		])]), front("d1908-2", "pavimentacao", [
			pav("d1908-2a", "enchimento_caixa", VIS, 270),
			pav("d1908-2b", "base", VIS, 70),
			pav("d1908-2c", "meio_fio", VIS, 127)
		])]),
		day("2026-08-20", [
			front("d2008-1", "drenagem", [dren("d2008-1a", "ramal", VIS, [pv("d2008-p1", "PV D17", 2, 4), pv("d2008-p2", "PV D18", 1, 3)])]),
			front("d2008-2", "drenagem", [dren("d2008-2a", "caixa_ralo", VIS, [
				pv("d2008-p3", "PV D8", 1),
				pv("d2008-p4", "PV D9", 1, 2),
				pv("d2008-p5", "PV D10", 1),
				pv("d2008-p6", "PV D11", 1, 2, 1)
			])]),
			front("d2008-3", "drenagem", [dren("d2008-3a", "alteamento", VIS, [pv("d2008-p7", "PV D1", 1, 0, 0, 2), pv("d2008-p8", "PV D2", 1, 0, 0, 2)])]),
			front("d2008-4", "pavimentacao", [
				pav("d2008-4a", "enchimento_caixa", VIS, 80),
				pav("d2008-4b", "base", VIS, 180),
				pav("d2008-4c", "meio_fio", VIS, 78)
			]),
			front("d2008-5", "pavimentacao", [pav("d2008-5a", "concretagem_calcada", JOS, 140)])
		]),
		day("2026-08-21", [
			front("d2108-1", "drenagem", [dren("d2108-1a", "ramal", VIS, [pv("d2108-p1", "PV D18", 2, 6), pv("d2108-p2", "PV D19", 2, 4)])]),
			front("d2108-2", "drenagem", [dren("d2108-2a", "caixa_ralo", VIS, [
				pv("d2108-p3", "PV D11", 1, 0, 1),
				pv("d2108-p4", "PV D12", 1, 0, 1),
				pv("d2108-p5", "PV D13", 1, 0, 1)
			])]),
			front("d2108-3", "drenagem", [dren("d2108-3a", "alteamento", VIS, [
				pv("d2108-p6", "PV D3", 1),
				pv("d2108-p7", "PV D4", 1),
				pv("d2108-p8", "PV D5", 1),
				pv("d2108-p9", "PV D6", 1),
				pv("d2108-p10", "PV D7", 1),
				pv("d2108-p11", "PV D8", 1, 0, 0, 16)
			])]),
			front("d2108-4", "pavimentacao", [
				pav("d2108-4a", "regularizacao", VIS, 90),
				pav("d2108-4b", "enchimento_subbase", VIS, 90),
				pav("d2108-4c", "sub_base", VIS, 80),
				pav("d2108-4d", "base", VIS, 90),
				pav("d2108-4e", "meio_fio", VIS, 64)
			]),
			front("d2108-5", "pavimentacao", [pav("d2108-5a", "concretagem_calcada", VIS, 66)])
		]),
		day("2026-08-24", [
			front("d2408-1", "drenagem", [dren("d2408-1a", "caixa_ralo", VIS, [pv("d2408-p1", "PV D13", 1, 0, 1)])]),
			front("d2408-2", "drenagem", [dren("d2408-2a", "alteamento", VIS, [pv("d2408-p2", "PV D15", 1, 0, 0, 2)])]),
			front("d2408-3", "pavimentacao", [
				pav("d2408-3a", "sub_base", VIS, 90),
				pav("d2408-3b", "base", VIS, 90),
				pav("d2408-3c", "regularizacao", PRE, 100)
			]),
			front("d2408-4", "pavimentacao", [pav("d2408-4a", "preparo_calcada", JOS, 96)]),
			front("d2408-5", "pavimentacao", [pav("d2408-5a", "cbuq", VIS, 200)])
		]),
		day("2026-08-25", [
			front("d2508-1", "pavimentacao", [
				pav("d2508-1a", "meio_fio", VIS, 131),
				pav("d2508-1b", "regularizacao", PRE, 150),
				pav("d2508-1c", "regularizacao", ALB, 250)
			]),
			front("d2508-2", "pavimentacao", [pav("d2508-2a", "preparo_calcada", JOS, 106, { semMetalon: true })]),
			front("d2508-3", "pavimentacao", [pav("d2508-3a", "cbuq", JOA, 60), pav("d2508-3b", "cbuq", VIS, 130)])
		], "Produção afetada — patrol quebrou às 11h"),
		day("2026-08-26", [
			front("d2608-1", "drenagem", [dren("d2608-1a", "ramal", VIS, [pv("d2608-p1", "PV D20", 2, 4), pv("d2608-p2", "PV D21", 3, 8)]), dren("d2608-1b", "ramal", PRE, [pv("d2608-p3", "PV A22.7", 1, 1)])]),
			front("d2608-2", "drenagem", [dren("d2608-2a", "caixa_ralo", VIS, [pv("d2608-p4", "PV D14", 1, 0, 1)])]),
			front("d2608-3", "pavimentacao", [pav("d2608-3a", "demolicao_calcada", PRE, 130, { existente: true })]),
			front("d2608-4", "pavimentacao", [pav("d2608-4a", "preparo_calcada", JOS, 170, { semMetalon: true })])
		]),
		day("2026-08-28", [
			front("d2808-1", "drenagem", [dren("d2808-1a", "ramal", VIS, [
				pv("d2808-p1", "PV D21", 1, 3),
				pv("d2808-p2", "PV D22", 2, 4),
				pv("d2808-p3", "PV D23", 1, 4)
			])]),
			front("d2808-2", "drenagem", [dren("d2808-2a", "caixa_ralo", VIS, [
				pv("d2808-p4", "PV D14", 1, 0, 1),
				pv("d2808-p5", "PV D15", 1, 0, 1),
				pv("d2808-p6", "PV D16", 2, 0, 1)
			])]),
			front("d2808-3", "pavimentacao", [
				pav("d2808-3a", "regularizacao", PRE, 50),
				pav("d2808-3b", "sub_base", PRE, 100),
				pav("d2808-3c", "meio_fio", VIS, 30)
			]),
			front("d2808-4", "pavimentacao", [pav("d2808-4a", "concretagem_calcada", JOS, 153)])
		], "Produção afetada por conta de solo saturado devido chuva do dia anterior"),
		day("2026-09-28", [], "", "Produção afetada por conta de solo saturado devido chuva. Falta de bica na obra de 28/09 a 30/09."),
		day("2026-09-29", [
			front("d2909-1", "drenagem", [dren("d2909-1a", "ramal", VIS, [pv("d2909-p1", "PV D30", 3, 11)])]),
			front("d2909-2", "pavimentacao", [
				pav("d2909-2a", "solo", VIS, 4, { soloUnit: "m3" }),
				pav("d2909-2b", "regularizacao", VIS, 180),
				pav("d2909-2c", "sub_base", VIS, 40)
			]),
			front("d2909-3", "pavimentacao", [pav("d2909-3a", "concretagem_calcada", JOA, 122)])
		]),
		day("2026-09-30", [
			front("d3009-1", "drenagem", [dren("d3009-1a", "ramal", VIS, [pv("d3009-p1", "PV D31", 1, 2), pv("d3009-p2", "PV D32", 2, 5)])]),
			front("d3009-2", "pavimentacao", [pav("d3009-2a", "regularizacao", ANG, 50), pav("d3009-2b", "regularizacao", VIS, 90)]),
			front("d3009-3", "pavimentacao", [pav("d3009-3a", "regularizacao", PRE, 240)])
		], "", "Pá carregadeira da usina de concreto quebrou, por esse motivo não teve concreto."),
		day("2026-10-01", [
			front("d0110-1", "pavimentacao", [pav("d0110-1a", "regularizacao", VIS, 180)]),
			front("d0110-2", "pavimentacao", [pav("d0110-2a", "preparo_calcada", JOA, 84), pav("d0110-2b", "concretagem_calcada", JOA, 63)]),
			front("d0110-3", "pavimentacao", [pav("d0110-3a", "piso_tatil", BAR, 36, { rampas: 2 })])
		], "", "Produção afetada por conta de solo saturado devido chuva."),
		day("2026-10-02", [front("d0210-1", "pavimentacao", [pav("d0210-1a", "concretagem_calcada", JOA, 60)]), front("d0210-2", "pavimentacao", [pav("d0210-2a", "piso_tatil", BAR, 36, { rampas: 2 })])], "Produção afetada por conta de chuva, 4mm de chuva durante o dia"),
		day("2026-10-06", [
			front("d0610-1", "pavimentacao", [pav("d0610-1a", "solo", VIS, 7.5, {
				soloUnit: "m",
				soloPv: "PV D24"
			}), pav("d0610-1b", "regularizacao", ANG, 100)]),
			front("d0610-2", "pavimentacao", [pav("d0610-2a", "sub_base", VIS, 70)]),
			front("d0610-3", "pavimentacao", [pav("d0610-3a", "preparo_calcada", PRE, 50), pav("d0610-3b", "concretagem_calcada", JOA, 120)]),
			front("d0610-4", "pavimentacao", [pav("d0610-4a", "piso_tatil", BAR, 54, { rampas: 3 })])
		])
	];
	const map = {};
	for (const item of list) map[item.date] = item;
	return map;
}
function emptyDay(date) {
	return {
		date,
		fronts: [],
		obs: "",
		recado: "",
		customText: null
	};
}
var KEY = "producao-do-dia-v1";
function uid(prefix) {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function patchDay(days, date, fn) {
	const current = days[date] ?? emptyDay(date);
	return {
		...days,
		[date]: fn(current)
	};
}
var hydrated = false;
var useDiario = create((set, get) => ({
	ready: false,
	days: {},
	streets: DEFAULT_STREETS,
	selected: todayISO(),
	banner: false,
	select: (iso) => set({ selected: iso }),
	dismissBanner: () => set({ banner: false }),
	addFront: (date, discipline) => {
		const id = uid("fr");
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: [...day.fronts, {
				id,
				discipline,
				lines: []
			}]
		})) });
		return id;
	},
	removeFront: (date, frontId) => {
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: day.fronts.filter((f) => f.id !== frontId)
		})) });
	},
	moveFront: (date, frontId, dir) => {
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: moveWithin(day.fronts, frontId, dir)
		})) });
	},
	addLines: (date, frontId, lines) => {
		if (!lines.length) return;
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: day.fronts.map((f) => f.id === frontId ? {
				...f,
				lines: [...f.lines, ...lines]
			} : f)
		})) });
	},
	replaceLine: (date, frontId, line) => {
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: day.fronts.map((f) => f.id === frontId ? {
				...f,
				lines: f.lines.map((l) => l.id === line.id ? line : l)
			} : f)
		})) });
	},
	removeLine: (date, frontId, lineId) => {
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: day.fronts.map((f) => f.id === frontId ? {
				...f,
				lines: f.lines.filter((l) => l.id !== lineId)
			} : f)
		})) });
	},
	moveLine: (date, frontId, lineId, dir) => {
		set({ days: patchDay(get().days, date, (day) => ({
			...day,
			fronts: day.fronts.map((f) => {
				if (f.id !== frontId) return f;
				const i = f.lines.findIndex((l) => l.id === lineId);
				const j = i + dir;
				if (i < 0 || j < 0 || j >= f.lines.length) return f;
				const lines = f.lines.slice();
				const [item] = lines.splice(i, 1);
				if (!item) return f;
				lines.splice(j, 0, item);
				return {
					...f,
					lines
				};
			})
		})) });
	},
	setObs: (date, obs) => set({ days: patchDay(get().days, date, (day) => ({
		...day,
		obs
	})) }),
	setRecado: (date, recado) => set({ days: patchDay(get().days, date, (day) => ({
		...day,
		recado
	})) }),
	setCustom: (date, customText) => set({ days: patchDay(get().days, date, (day) => ({
		...day,
		customText
	})) }),
	removeDay: (date) => {
		const days = { ...get().days };
		delete days[date];
		set({ days });
	},
	rememberStreet: (street) => {
		const name = streetName(street);
		if (!name) return;
		if (get().streets.some((s) => s.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"))) return;
		set({ streets: [...get().streets, name] });
	}
}));
function moveWithin(fronts, id, dir) {
	const front = fronts.find((f) => f.id === id);
	if (!front) return fronts;
	const same = fronts.filter((f) => f.discipline === front.discipline);
	const idx = same.findIndex((f) => f.id === id);
	const swap = idx + dir;
	if (idx < 0 || swap < 0 || swap >= same.length) return fronts;
	const a = same[idx];
	const b = same[swap];
	if (!a || !b) return fronts;
	const next = fronts.slice();
	const ia = next.findIndex((f) => f.id === a.id);
	const ib = next.findIndex((f) => f.id === b.id);
	next[ia] = b;
	next[ib] = a;
	return next;
}
function hydrateDiario() {
	if (hydrated || typeof window === "undefined") return;
	hydrated = true;
	let next = {
		days: seedDays(),
		streets: DEFAULT_STREETS,
		selected: todayISO(),
		banner: true
	};
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const data = JSON.parse(raw);
			next = {
				days: data.days && typeof data.days === "object" ? data.days : seedDays(),
				streets: Array.isArray(data.streets) && data.streets.length ? data.streets : DEFAULT_STREETS,
				selected: typeof data.selected === "string" ? data.selected : todayISO(),
				banner: Boolean(data.banner)
			};
		}
	} catch {}
	useDiario.setState({
		...next,
		ready: true
	});
}
if (typeof window !== "undefined") useDiario.subscribe((state) => {
	if (!state.ready) return;
	const payload = {
		days: state.days,
		streets: state.streets,
		selected: state.selected,
		banner: state.banner
	};
	localStorage.setItem(KEY, JSON.stringify(payload));
});
function newId(prefix) {
	return uid(prefix);
}
function joinPt(parts) {
	const clean = parts.filter(Boolean);
	if (clean.length === 0) return "";
	if (clean.length === 1) return clean[0];
	if (clean.length === 2) return `${clean[0]} e ${clean[1]}`;
	return `${clean.slice(0, -1).join(", ")} e ${clean[clean.length - 1]}`;
}
function decap(s) {
	if (!s) return s;
	return s.charAt(0).toLocaleLowerCase("pt-BR") + s.slice(1);
}
function countNoun(n, one, many) {
	return `${fmtNum(n)} ${n === 1 ? one : many}`;
}
function materialClause(p, kind) {
	const tubos = p.tubos > 0 ? `${countNoun(p.tubos, "tubo", "tubos")} de 400` : "";
	const pro = p.prolongadores > 0 ? countNoun(p.prolongadores, "Prolongador", "Prolongadores") : "";
	const aneis = p.aneis > 0 ? `${countNoun(p.aneis, "anel", "anéis")} de concreto` : "";
	const bits = [];
	if (kind === "caixa_ralo") {
		if (pro) bits.push(pro);
		if (tubos) bits.push(tubos);
		if (aneis) bits.push(aneis);
	} else if (kind === "alteamento") {
		if (aneis) bits.push(aneis);
	} else {
		if (tubos) bits.push(tubos);
		if (pro) bits.push(pro);
		if (aneis) bits.push(aneis);
	}
	return bits.length ? `(${joinPt(bits)})` : "";
}
function naRua(street) {
	const name = streetName(street);
	return name ? ` na rua ${name}` : "";
}
function pavingPhrase(line) {
	const m = fmtNum(line.qty);
	switch (line.kind) {
		case "regularizacao": return `Regularização de ${m}m de sub leito`;
		case "sub_base": return `Execução de ${m}m de sub base`;
		case "base": return `Execução de ${m}m de base`;
		case "meio_fio": return `Concretagem de ${m}m de meio fio`;
		case "preparo_calcada": return `Preparo de ${m}m de calçada${line.semMetalon ? " sem metalon" : ""}`;
		case "concretagem_calcada": return `Concretagem de ${m}m de calçada`;
		case "demolicao_calcada": return `Demolição de ${m}m de calçada${line.existente ? " existente" : ""}`;
		case "enchimento_caixa": return `Enchimento de ${m}m de caixa de rua`;
		case "enchimento_subbase": return `Enchimento de ${m}m de sub base`;
		case "cbuq": return line.approx === false ? `Aplicação de ${m}T de CBUQ` : `Aplicação de aproximadamente ${m}T de CBUQ`;
		case "solo": return `Troca de ${m}${line.soloUnit === "m" ? "m" : "m³"} de solo borrachudo${line.soloPv?.trim() ? ` no ${line.soloPv.trim()}` : ""}`;
		case "piso_tatil": {
			const pecas = line.qty;
			const r = line.rampas ?? 0;
			return `Colocação e fixação de ${countNoun(pecas, "piso tátil", "pisos táteis")}${r > 0 ? ` em ${countNoun(r, "rampa", "rampas")}` : ""}`;
		}
		default: return "";
	}
}
function familyOf(kind) {
	if (kind === "ramal") return "ramal";
	if (kind === "caixa_ralo") return "caixa";
	if (kind === "alteamento") return "alteamento";
	return "pav";
}
function lineActive(line) {
	if (line.kind === "ramal" || line.kind === "caixa_ralo") return line.pvs.some((p) => p.code.trim() && p.qty > 0);
	if (line.kind === "alteamento") return line.pvs.some((p) => p.code.trim());
	return line.qty > 0;
}
function pvExec(kind, pvs, street) {
	const bits = pvs.filter((p) => p.code.trim() && p.qty > 0).map((p) => {
		return `${kind === "ramal" ? countNoun(p.qty, "ramal", "ramais") : countNoun(p.qty, "caixa ralo", "caixas ralo")} no ${p.code.trim()}${materialClause(p, kind)}`;
	});
	if (!bits.length) return "";
	return `Execução de ${joinPt(bits)}${naRua(street)}`;
}
function renderAlteamento(pvs, street) {
	const list = pvs.filter((p) => p.code.trim());
	if (!list.length) return "";
	const any = list.some((p) => p.aneis > 0);
	return `${list.length >= 3 && !any ? "Alteamento da tampa dos" : "Alteamento da tampa do"} ${joinPt(list.map((p) => `${p.code.trim()}${materialClause(p, "alteamento")}`))}${naRua(street)}`;
}
function renderPaving(lines, street) {
	const phrases = lines.filter((l) => l.qty > 0).map(pavingPhrase).filter(Boolean);
	if (!phrases.length) return "";
	return `${joinPt(phrases.map((p, i) => i === 0 ? p : decap(p)))}${naRua(street)}`;
}
function renderFront(front) {
	const clusters = [];
	for (const line of front.lines) {
		if (!lineActive(line)) continue;
		const family = familyOf(line.kind);
		const keyStreet = streetName(line.street).toLocaleLowerCase("pt-BR");
		const last = clusters[clusters.length - 1];
		if (last && last.family === family && streetName(last.street).toLocaleLowerCase("pt-BR") === keyStreet) last.lines.push(line);
		else clusters.push({
			family,
			street: line.street,
			lines: [line]
		});
	}
	return clusters.map((c) => {
		if (c.family === "ramal") return pvExec("ramal", c.lines.flatMap((l) => l.pvs), c.street);
		if (c.family === "caixa") return pvExec("caixa_ralo", c.lines.flatMap((l) => l.pvs), c.street);
		if (c.family === "alteamento") return renderAlteamento(c.lines.flatMap((l) => l.pvs), c.street);
		return renderPaving(c.lines, c.street);
	}).filter(Boolean).join(" / ");
}
function renderDay(day) {
	const out = [`Produção do dia ${formatBR(day.date)}`, ""];
	const push = (label, discipline) => {
		day.fronts.filter((f) => f.discipline === discipline && renderFront(f)).forEach((f, i) => {
			out.push(`${label} ${i + 1}: ${renderFront(f)}`);
			out.push("");
		});
	};
	push("Drenagem", "drenagem");
	push("Pavimentação", "pavimentacao");
	if (day.obs.trim()) out.push(`Obs: ${day.obs.trim()}`);
	return out.join("\n").replace(/\n+$/g, "");
}
function textToCopy(day) {
	if (day.customText != null) return day.customText;
	return renderDay(day);
}
function hasBody(day) {
	if (day.customText != null) return day.customText.trim().length > 0;
	if (day.obs.trim()) return true;
	return day.fronts.some((f) => renderFront(f).length > 0);
}
function lineSummary(line) {
	const title = ACTIVITY_META[line.kind].short;
	const street = streetName(line.street);
	if (line.kind === "ramal" || line.kind === "caixa_ralo" || line.kind === "alteamento") return {
		title,
		detail: [street, line.pvs.filter((p) => p.code.trim()).map((p) => {
			const extras = [
				p.tubos > 0 ? `${fmtNum(p.tubos)} tubos` : "",
				p.prolongadores > 0 ? `${fmtNum(p.prolongadores)} prolong.` : "",
				p.aneis > 0 ? `${fmtNum(p.aneis)} anéis` : ""
			].filter(Boolean);
			const head = line.kind === "alteamento" ? p.code.trim() : `${fmtNum(p.qty)}× ${p.code.trim()}`;
			return extras.length ? `${head} (${extras.join(", ")})` : head;
		}).join(", ")].filter(Boolean).join(" · ")
	};
	const extras = [];
	if (line.semMetalon) extras.push("sem metalon");
	if (line.existente) extras.push("existente");
	if (line.kind === "solo" && line.soloPv) extras.push(line.soloPv);
	if (line.kind === "piso_tatil" && line.rampas) extras.push(`${fmtNum(line.rampas)} rampas`);
	let qty = "";
	if (line.kind === "cbuq") qty = `${fmtNum(line.qty)}t`;
	else if (line.kind === "solo") qty = `${fmtNum(line.qty)}${line.soloUnit === "m" ? "m" : "m³"}`;
	else if (line.kind === "piso_tatil") qty = `${fmtNum(line.qty)} pç`;
	else qty = `${fmtNum(line.qty)}m`;
	return {
		title,
		detail: [
			qty,
			street,
			extras.join(", ")
		].filter(Boolean).join(" · ")
	};
}
function frontHeading(day, front) {
	const label = front.discipline === "drenagem" ? "Drenagem" : "Pavimentação";
	const n = day.fronts.filter((f) => f.discipline === front.discipline && renderFront(f)).findIndex((f) => f.id === front.id);
	if (n < 0) return `${label} · vazia`;
	return `${label} ${n + 1}`;
}
var VARIANT = {
	primary: "bg-primary text-primary-fg hover:opacity-90",
	dren: "bg-dren text-dren-fg hover:opacity-90",
	soft: "bg-soft text-ink hover:bg-line",
	line: "border border-line bg-paper text-ink hover:bg-soft",
	ghost: "bg-transparent text-ink hover:bg-soft"
};
function Button({ variant = "primary", className = "", type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: `inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition-opacity disabled:opacity-40 ${VARIANT[variant]} ${className}`,
		...props
	});
}
function IconButton({ className = "", type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: `inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink hover:bg-soft disabled:opacity-30 ${className}`,
		...props
	});
}
function Stepper({ value, onChange, blankZero = false, quick = false, label }) {
	const [text, setText] = (0, import_react.useState)(() => blankZero && value === 0 ? "" : fmtNum(value));
	const [focused, setFocused] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focused) setText(blankZero && value === 0 ? "" : fmtNum(value));
	}, [
		value,
		focused,
		blankZero
	]);
	const commit = (raw) => {
		setText(raw);
		onChange(parseQty(raw));
	};
	const bump = (delta) => {
		onChange(Math.max(0, Math.round((value + delta) * 100) / 100));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-end gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center rounded-xl bg-soft text-lg text-ink",
					onClick: () => bump(-1),
					"aria-label": `Diminuir ${label}`,
					children: "−"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "decimal",
					"aria-label": label,
					value: text,
					onFocus: () => setFocused(true),
					onBlur: () => {
						setFocused(false);
						setText(blankZero && value === 0 ? "" : fmtNum(value));
					},
					onChange: (e) => {
						const raw = e.target.value;
						if (!/^[\d.,]*$/.test(raw)) return;
						commit(raw);
					},
					className: "h-11 w-16 rounded-xl border border-line bg-paper text-center text-base font-semibold text-ink outline-none focus:border-primary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center rounded-xl bg-soft text-lg text-ink",
					onClick: () => bump(1),
					"aria-label": `Aumentar ${label}`,
					children: "+"
				})
			]
		}), quick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: [10, 50].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "h-8 rounded-lg bg-soft px-2 text-sm font-semibold text-muted",
				onClick: () => bump(n),
				children: ["+", n]
			}, n))
		}) : null]
	});
}
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const area = document.createElement("textarea");
			area.value = text;
			area.setAttribute("readonly", "");
			area.style.position = "fixed";
			area.style.left = "-999px";
			document.body.appendChild(area);
			area.select();
			const ok = document.execCommand("copy");
			area.remove();
			return ok;
		} catch {
			return false;
		}
	}
}
function whatsAppHref(text) {
	return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
function FieldLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold uppercase tracking-widest text-muted",
		children
	});
}
function NotesFields({ date }) {
	const obs = useDiario((s) => s.days[date]?.obs ?? "");
	const recado = useDiario((s) => s.days[date]?.recado ?? "");
	const setObs = useDiario((s) => s.setObs);
	const setRecado = useDiario((s) => s.setRecado);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Observação no texto" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: obs,
				onChange: (e) => setObs(date, e.target.value),
				rows: 3,
				placeholder: "Produção afetada por conta de...",
				className: "mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: OBS_CHIPS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setObs(date, appendNote(obs, chip)),
					className: "h-10 shrink-0 rounded-full bg-soft px-3 text-sm font-medium text-ink",
					children: chip.replace("Produção afetada por conta de ", "").replace("Produção afetada — ", "")
				}, chip))
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Recado separado" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Chuva, bica, usina, máquina — não entra no texto da produção."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: recado,
				onChange: (e) => setRecado(date, e.target.value),
				rows: 3,
				placeholder: "Falta de bica na obra",
				className: "mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: RECADO_CHIPS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setRecado(date, appendNote(recado, chip)),
					className: "h-10 shrink-0 rounded-full bg-soft px-3 text-sm font-medium text-ink",
					children: chip.length > 42 ? `${chip.slice(0, 40)}…` : chip
				}, chip))
			})
		] })]
	});
}
function PreviewCard({ day, compact = false }) {
	const text = textToCopy(day);
	const ready = hasBody(day);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const copy = async (value, which) => {
		if (!await copyText(value)) return;
		setCopied(which);
		window.setTimeout(() => setCopied(null), 1800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border border-line bg-paper p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-widest text-muted",
				children: "Texto do dia"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: formatBR(day.date, true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				"data-testid": "preview-text",
				className: `mt-3 overflow-auto whitespace-pre-wrap font-sans text-base leading-relaxed text-ink ${compact ? "max-h-40" : "max-h-96"}`,
				children: ready ? text : day.recado.trim() ? "Sem frente de produção neste dia." : "Adicione um serviço para montar o texto."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						disabled: !ready,
						onClick: () => copy(text, "text"),
						children: [copied === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-5" }), copied === "text" ? "Copiado" : "Copiar texto"]
					}),
					ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: whatsAppHref(text),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex h-12 items-center justify-center rounded-xl bg-dren text-base font-semibold text-dren-fg",
						children: "Abrir no WhatsApp"
					}) : null,
					day.recado.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						className: "w-full",
						onClick: () => copy(day.recado.trim(), "recado"),
						children: copied === "recado" ? "Recado copiado" : "Copiar recado"
					}) : null
				]
			})
		]
	});
}
function blankPv() {
	return {
		id: newId("pv"),
		code: "",
		qty: 1,
		tubos: 0,
		prolongadores: 0,
		aneis: 0
	};
}
function pvFromEntry(p) {
	return {
		id: p.id,
		code: p.code,
		qty: p.qty || 1,
		tubos: p.tubos || 0,
		prolongadores: p.prolongadores || 0,
		aneis: p.aneis || 0
	};
}
function ServiceSheet({ date, sheet, onClose }) {
	const streets = useDiario((s) => s.streets);
	const days = useDiario((s) => s.days);
	const codes = (0, import_react.useMemo)(() => collectCodes(days), [days]);
	const addLines = useDiario((s) => s.addLines);
	const replaceLine = useDiario((s) => s.replaceLine);
	const rememberStreet = useDiario((s) => s.rememberStreet);
	const open = sheet != null;
	const discipline = sheet?.discipline ?? "pavimentacao";
	const editing = sheet?.mode === "edit" ? sheet.line : null;
	const [kind, setKind] = (0, import_react.useState)("ramal");
	const [street, setStreet] = (0, import_react.useState)("");
	const [pvs, setPvs] = (0, import_react.useState)([blankPv()]);
	const [qty, setQty] = (0, import_react.useState)({});
	const [semMetalon, setSemMetalon] = (0, import_react.useState)(false);
	const [existente, setExistente] = (0, import_react.useState)(false);
	const [approx, setApprox] = (0, import_react.useState)(true);
	const [soloUnit, setSoloUnit] = (0, import_react.useState)("m3");
	const [soloPv, setSoloPv] = (0, import_react.useState)("");
	const [rampas, setRampas] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const sheetKey = !sheet ? "" : sheet.mode === "edit" ? `e-${sheet.line.id}` : `a-${sheet.frontId}-${sheet.discipline}`;
	const [seenKey, setSeenKey] = (0, import_react.useState)(sheetKey);
	if (seenKey !== sheetKey) {
		setSeenKey(sheetKey);
		setError("");
		if (sheet?.mode === "edit") {
			const line = sheet.line;
			setKind(line.kind);
			setStreet(line.street);
			setPvs(line.pvs.length ? line.pvs.map(pvFromEntry) : [blankPv()]);
			setQty({ [line.kind]: line.qty });
			setSemMetalon(Boolean(line.semMetalon));
			setExistente(Boolean(line.existente));
			setApprox(line.approx !== false);
			setSoloUnit(line.soloUnit === "m" ? "m" : "m3");
			setSoloPv(line.soloPv ?? "");
			setRampas(line.rampas ?? 0);
		} else if (sheet) {
			setKind(sheet.discipline === "drenagem" ? "ramal" : "regularizacao");
			setStreet("");
			setPvs([blankPv()]);
			setQty({});
			setSemMetalon(false);
			setExistente(false);
			setApprox(true);
			setSoloUnit("m3");
			setSoloPv("");
			setRampas(0);
		}
	}
	const pavingKinds = editing && discipline === "pavimentacao" ? [editing.kind] : PAVING_ORDER;
	const draftLines = (0, import_react.useMemo)(() => {
		if (!sheet || !streetName(street)) return [];
		if (discipline === "drenagem") return [{
			id: editing?.id ?? "draft",
			kind,
			street,
			qty: 0,
			pvs: pvs.map((p) => ({
				id: p.id,
				code: p.code.trim(),
				qty: kind === "alteamento" ? 1 : p.qty,
				tubos: kind === "alteamento" ? 0 : p.tubos,
				prolongadores: kind === "alteamento" ? 0 : p.prolongadores,
				aneis: kind === "alteamento" ? p.aneis : 0
			}))
		}];
		return pavingKinds.map((k) => toPavingLine(k, street, qty[k] ?? 0, editing?.id ?? `draft-${k}`, {
			semMetalon,
			existente,
			approx,
			soloUnit,
			soloPv,
			rampas
		})).filter((l) => l != null);
	}, [
		sheet,
		street,
		discipline,
		kind,
		pvs,
		pavingKinds,
		qty,
		editing?.id,
		semMetalon,
		existente,
		approx,
		soloUnit,
		soloPv,
		rampas
	]);
	const phrase = (0, import_react.useMemo)(() => {
		return renderFront({
			id: "draft",
			discipline,
			lines: draftLines
		});
	}, [draftLines, discipline]);
	const save = (another) => {
		if (!sheet) return;
		if (!streetName(street)) {
			setError("Escolha a rua.");
			return;
		}
		if (!draftLines.length || !renderFront({
			id: "x",
			discipline,
			lines: draftLines
		})) {
			setError(discipline === "drenagem" ? "Informe o PV e a quantidade." : "Informe ao menos uma quantidade.");
			return;
		}
		rememberStreet(street);
		if (sheet.mode === "edit") {
			const line = draftLines[0];
			if (line) replaceLine(date, sheet.frontId, line);
			onClose();
			return;
		}
		addLines(date, sheet.frontId, draftLines.map((l) => ({
			...l,
			id: newId("ln"),
			pvs: l.pvs.map((p) => ({
				...p,
				id: p.id || newId("pv")
			}))
		})));
		if (another) {
			setStreet("");
			setQty({});
			setPvs([blankPv()]);
			setSoloPv("");
			setRampas(0);
			setError("");
			return;
		}
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col rounded-t-3xl bg-paper shadow-2xl outline-none lg:inset-x-auto lg:bottom-16 lg:left-1/2 lg:top-16 lg:w-full lg:max-w-xl lg:-translate-x-1/2 lg:rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-lg font-semibold text-ink",
						children: editing ? "Editar serviço" : discipline === "drenagem" ? "Serviço de drenagem" : "Serviço de pavimentação"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-sm text-muted",
						children: "A frase do WhatsApp se monta aqui embaixo."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink hover:bg-soft",
						"aria-label": "Fechar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
					children: [
						discipline === "drenagem" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex flex-wrap gap-2",
							children: DRAIN_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setKind(k),
								className: `h-11 rounded-xl px-3 text-sm font-semibold ${kind === k ? "bg-dren text-dren-fg" : "bg-soft text-ink"}`,
								children: ACTIVITY_META[k].short
							}, k))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Rua" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2 overflow-x-auto pb-2",
							children: streets.map((name) => {
								const on = streetKey(name) === streetKey(street) && streetName(street).length > 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStreet(name),
									className: `h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${on ? "bg-ink text-paper" : "bg-soft text-ink"}`,
									children: name
								}, name);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: streets.some((s) => streetKey(s) === streetKey(street)) ? "" : street,
							onChange: (e) => setStreet(e.target.value),
							placeholder: "Outra rua",
							className: "mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink outline-none focus:border-primary"
						}),
						discipline === "drenagem" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: kind === "alteamento" ? "PVs" : kind === "ramal" ? "Ramais por PV" : "Caixas por PV" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "pv-codes",
									children: codes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: c }, c))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-col gap-3",
									children: pvs.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-surface p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													list: "pv-codes",
													value: row.code,
													onChange: (e) => updatePv(setPvs, row.id, { code: e.target.value }),
													placeholder: "PV D12",
													"aria-label": `Código do PV ${index + 1}`,
													className: "h-12 min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 text-base font-semibold text-ink outline-none focus:border-primary"
												}), pvs.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "h-12 rounded-xl px-3 text-sm font-semibold text-muted",
													onClick: () => setPvs((rows) => rows.filter((r) => r.id !== row.id)),
													children: "Tirar"
												}) : null]
											}),
											kind !== "alteamento" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyLine, {
												label: kind === "ramal" ? "Quantidade" : "Caixas",
												value: row.qty,
												onChange: (n) => updatePv(setPvs, row.id, { qty: n })
											}) : null,
											kind === "ramal" || kind === "caixa_ralo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyLine, {
												label: "Tubos de 400",
												value: row.tubos,
												onChange: (n) => updatePv(setPvs, row.id, { tubos: n })
											}) : null,
											kind === "ramal" || kind === "caixa_ralo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyLine, {
												label: "Prolongadores",
												value: row.prolongadores,
												onChange: (n) => updatePv(setPvs, row.id, { prolongadores: n })
											}) : null,
											kind === "alteamento" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyLine, {
												label: "Anéis de concreto",
												value: row.aneis,
												onChange: (n) => updatePv(setPvs, row.id, { aneis: n })
											}) : null
										]
									}, row.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-3 h-11 rounded-xl bg-soft px-3 text-sm font-semibold text-ink",
									onClick: () => setPvs((rows) => [...rows, blankPv()]),
									children: "Outro PV"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 flex flex-col",
							children: pavingKinds.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3 border-b border-line py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-ink",
											children: ACTIVITY_META[k].label
										}),
										k === "preparo_calcada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
											label: "Sem metalon",
											checked: semMetalon,
											onChange: setSemMetalon
										}) : null,
										k === "demolicao_calcada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
											label: "Calçada existente",
											checked: existente,
											onChange: setExistente
										}) : null,
										k === "cbuq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check$1, {
											label: "Aproximadamente",
											checked: approx,
											onChange: setApprox
										}) : null,
										k === "solo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex gap-2",
											children: ["m3", "m"].map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSoloUnit(u),
												className: `h-9 rounded-lg px-3 text-sm font-semibold ${soloUnit === u ? "bg-ink text-paper" : "bg-soft text-ink"}`,
												children: u === "m3" ? "m³" : "m"
											}, u))
										}) : null,
										k === "solo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: soloPv,
											onChange: (e) => setSoloPv(e.target.value),
											placeholder: "PV, se houver",
											className: "mt-2 h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink outline-none focus:border-primary"
										}) : null,
										k === "piso_tatil" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: "Rampas"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
												label: "Rampas",
												value: rampas,
												onChange: setRampas
											})]
										}) : null
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
									label: ACTIVITY_META[k].label,
									value: qty[k] ?? 0,
									blankZero: true,
									quick: k !== "piso_tatil" && k !== "solo" && k !== "cbuq",
									onChange: (n) => setQty((q) => ({
										...q,
										[k]: n
									}))
								})]
							}, k))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-2xl bg-soft p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Frase" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base leading-relaxed text-ink",
								children: phrase || "Preencha a rua e as quantidades."
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-semibold text-primary",
							children: error
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t border-line p-4 sm:flex-row",
					children: [sheet?.mode === "add" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						className: "sm:flex-1",
						onClick: () => save(true),
						children: "Salvar e outra rua"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: discipline === "drenagem" ? "dren" : "primary",
						className: "sm:flex-1",
						onClick: () => save(false),
						children: "Salvar na frente"
					})]
				})
			]
		})] })
	});
}
function QtyLine({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-ink",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
			label,
			value,
			onChange
		})]
	});
}
function Check$1({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 flex items-center gap-2 text-sm text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "size-4 accent-primary"
		}), label]
	});
}
function updatePv(setPvs, id, patch) {
	setPvs((rows) => rows.map((r) => r.id === id ? {
		...r,
		...patch
	} : r));
}
function toPavingLine(kind, street, amount, id, flags) {
	if (amount <= 0) return null;
	return {
		id,
		kind,
		street,
		qty: amount,
		pvs: [],
		semMetalon: kind === "preparo_calcada" ? flags.semMetalon : void 0,
		existente: kind === "demolicao_calcada" ? flags.existente : void 0,
		approx: kind === "cbuq" ? flags.approx : void 0,
		soloUnit: kind === "solo" ? flags.soloUnit : void 0,
		soloPv: kind === "solo" ? flags.soloPv.trim() : void 0,
		rampas: kind === "piso_tatil" ? flags.rampas : void 0
	};
}
function collectCodes(days) {
	const set = /* @__PURE__ */ new Set();
	for (const day of Object.values(days)) for (const front of day.fronts) for (const line of front.lines) {
		for (const pv of line.pvs) if (pv.code.trim()) set.add(pv.code.trim());
		if (line.soloPv?.trim()) set.add(line.soloPv.trim());
	}
	return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
function DayScreen({ onOpenText }) {
	const selected = useDiario((s) => s.selected);
	const stored = useDiario((s) => s.days[selected]);
	const banner = useDiario((s) => s.banner);
	const select = useDiario((s) => s.select);
	const dismissBanner = useDiario((s) => s.dismissBanner);
	const addFront = useDiario((s) => s.addFront);
	const removeFront = useDiario((s) => s.removeFront);
	const moveFront = useDiario((s) => s.moveFront);
	const removeLine = useDiario((s) => s.removeLine);
	const moveLine = useDiario((s) => s.moveLine);
	const removeDay = useDiario((s) => s.removeDay);
	const [sheet, setSheet] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const day = stored ?? emptyDay(selected);
	const dren = day.fronts.filter((f) => f.discipline === "drenagem");
	const pav = day.fronts.filter((f) => f.discipline === "pavimentacao");
	const empty = day.fronts.length === 0;
	const openNew = (discipline) => {
		const id = addFront(selected, discipline);
		setSheet({
			mode: "add",
			frontId: id,
			discipline
		});
	};
	const closeSheet = () => {
		if (sheet?.mode === "add") {
			const front = useDiario.getState().days[selected]?.fronts.find((f) => f.id === sheet.frontId);
			if (front && front.lines.length === 0) removeFront(selected, front.id);
		}
		setSheet(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								"aria-label": "Dia anterior",
								onClick: () => {
									select(shiftISO(selected, -1));
									setConfirmDelete(false);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-3xl font-semibold tracking-tight text-ink",
									children: formatBR(selected)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm capitalize text-muted",
									children: [
										weekday(selected, true),
										" · ",
										selected.slice(0, 4)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								"aria-label": "Próximo dia",
								onClick: () => {
									select(shiftISO(selected, 1));
									setConfirmDelete(false);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-6" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 flex items-center justify-center gap-2 text-sm font-medium text-muted",
						children: ["Ir para a data", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: selected,
							onChange: (e) => {
								if (e.target.value) select(e.target.value);
							},
							className: "h-11 rounded-xl border border-line bg-paper px-3 text-base text-ink"
						})]
					}),
					banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-2xl border border-line bg-paper p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-ink",
							children: "Os relatos de 10/08 a 06/10 já estão em Dias, com chuva, bica e totais. Este dia está livre para lançar."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-xl bg-soft px-3 text-sm font-semibold text-ink",
								onClick: () => onOpenText("2026-08-10"),
								children: "Ver o texto de 10/08"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-xl px-3 text-sm font-semibold text-muted",
								onClick: dismissBanner,
								children: "Entendi"
							})]
						})]
					}) : null,
					empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-3xl border border-dashed border-line bg-surface px-4 py-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl font-semibold text-ink",
								children: ["Nada lançado em ", formatBR(selected)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-2 max-w-sm text-base leading-relaxed text-muted",
								children: "Abra a frente que trabalhou. O texto sai no formato da mensagem: Drenagem 1, Pavimentação 1, observação no fim."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "dren",
									onClick: () => openNew("drenagem"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-5" }), " Drenagem"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => openNew("pavimentacao"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "size-5" }), " Pavimentação"]
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-4",
						children: [
							dren.map((front) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontCard, {
								heading: frontHeading(day, front),
								tone: "dren",
								canUp: dren[0]?.id !== front.id,
								canDown: dren[dren.length - 1]?.id !== front.id,
								onUp: () => moveFront(selected, front.id, -1),
								onDown: () => moveFront(selected, front.id, 1),
								onRemove: () => removeFront(selected, front.id),
								onAdd: () => setSheet({
									mode: "add",
									frontId: front.id,
									discipline: "drenagem"
								}),
								onEdit: (line) => setSheet({
									mode: "edit",
									frontId: front.id,
									discipline: "drenagem",
									line
								}),
								onRemoveLine: (id) => removeLine(selected, front.id, id),
								onMoveLine: (id, dir) => moveLine(selected, front.id, id, dir),
								lines: front.lines,
								phrase: renderFront(front)
							}, front.id)),
							pav.map((front) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontCard, {
								heading: frontHeading(day, front),
								tone: "pav",
								canUp: pav[0]?.id !== front.id,
								canDown: pav[pav.length - 1]?.id !== front.id,
								onUp: () => moveFront(selected, front.id, -1),
								onDown: () => moveFront(selected, front.id, 1),
								onRemove: () => removeFront(selected, front.id),
								onAdd: () => setSheet({
									mode: "add",
									frontId: front.id,
									discipline: "pavimentacao"
								}),
								onEdit: (line) => setSheet({
									mode: "edit",
									frontId: front.id,
									discipline: "pavimentacao",
									line
								}),
								onRemoveLine: (id) => removeLine(selected, front.id, id),
								onMoveLine: (id, dir) => moveLine(selected, front.id, id, dir),
								lines: front.lines,
								phrase: renderFront(front)
							}, front.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "line",
									className: "flex-1",
									onClick: () => openNew("drenagem"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), " Drenagem"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "line",
									className: "flex-1",
									onClick: () => openNew("pavimentacao"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), " Pavimentação"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesFields, { date: selected }),
					stored ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								className: "flex-1",
								onClick: () => {
									removeDay(selected);
									setConfirmDelete(false);
								},
								children: "Apagar este dia"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "line",
								onClick: () => setConfirmDelete(false),
								children: "Cancelar"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm font-semibold text-muted",
							onClick: () => setConfirmDelete(true),
							children: "Apagar lançamentos deste dia"
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewCard, {
							day,
							compact: true
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-4 hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewCard, { day })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceSheet, {
				date: selected,
				sheet,
				onClose: closeSheet
			})
		]
	});
}
function FrontCard({ heading, tone, lines, phrase, canUp, canDown, onUp, onDown, onRemove, onAdd, onEdit, onRemoveLine, onMoveLine }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `rounded-3xl border border-line bg-paper p-4 ${tone === "dren" ? "border-l-4 border-l-dren" : "border-l-4 border-l-primary"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-ink",
						children: heading
					}), phrase ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-3 text-sm leading-relaxed text-muted",
						children: phrase
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Frente sem serviço."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							"aria-label": "Subir frente",
							disabled: !canUp,
							onClick: onUp,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							"aria-label": "Descer frente",
							disabled: !canDown,
							onClick: onDown,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							"aria-label": "Apagar frente",
							onClick: onRemove,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-2",
				children: lines.map((line, index) => {
					const summary = lineSummary(line);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-1 rounded-2xl bg-surface px-2 py-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onEdit(line),
								className: "min-w-0 flex-1 px-2 py-2 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-ink",
									children: summary.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-muted",
									children: summary.detail
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								"aria-label": "Subir serviço",
								disabled: index === 0,
								onClick: () => onMoveLine(line.id, -1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								"aria-label": "Descer serviço",
								disabled: index === lines.length - 1,
								onClick: () => onMoveLine(line.id, 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								"aria-label": "Apagar serviço",
								onClick: () => onRemoveLine(line.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						]
					}, line.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onAdd,
				className: "mt-3 inline-flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Serviço nesta frente"]
			})
		]
	});
}
function DaysScreen({ onOpen }) {
	const days = useDiario((s) => s.days);
	const select = useDiario((s) => s.select);
	const list = (0, import_react.useMemo)(() => Object.values(days).sort((a, b) => b.date.localeCompare(a.date)), [days]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-semibold tracking-tight text-ink",
			children: "Dias"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Toque um dia para abrir e copiar de novo."
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 rounded-3xl bg-paper p-6 text-base text-muted",
			children: "Nenhum dia salvo ainda."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 flex flex-col gap-2",
			children: list.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => {
					select(day.date);
					onOpen();
				},
				className: "w-full rounded-2xl bg-paper p-4 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xl font-semibold text-ink",
							children: formatBR(day.date)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm capitalize text-muted",
							children: weekday(day.date, true)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: summary(day)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 truncate text-sm text-ink",
						children: snippet(day)
					})
				]
			}) }, day.date))
		})
	] });
}
function summary(day) {
	const dren = day.fronts.filter((f) => f.discipline === "drenagem" && renderFront(f)).length;
	const pav = day.fronts.filter((f) => f.discipline === "pavimentacao" && renderFront(f)).length;
	if (!dren && !pav) {
		if (day.recado.trim() || day.obs.trim()) return "Sem produção · tem recado";
		return "Dia vazio";
	}
	return [
		dren ? `${dren} drenagem` : "",
		pav ? `${pav} pavimentação` : "",
		day.obs.trim() ? "com obs" : ""
	].filter(Boolean).join(" · ");
}
function snippet(day) {
	return renderDay(day).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("Produção do dia"))[0] || day.recado.trim() || "—";
}
function TextScreen() {
	const selected = useDiario((s) => s.selected);
	const stored = useDiario((s) => s.days[selected]);
	const setCustom = useDiario((s) => s.setCustom);
	const day = stored ?? emptyDay(selected);
	const generated = renderDay(day);
	const edited = day.customText != null && day.customText !== generated;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-2xl flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-2xl font-semibold tracking-tight text-ink",
				children: ["Texto de ", formatBR(selected)]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm capitalize text-muted",
				children: weekday(selected, true)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewCard, { day }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Ajuste fino" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "O texto acima segue os lançamentos. Se mudar uma palavra aqui, a cópia usa a sua versão."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: day.customText ?? generated,
					onChange: (e) => setCustom(selected, e.target.value),
					rows: 14,
					"aria-label": "Texto da produção",
					className: "mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
				}),
				day.customText != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-3",
					children: [edited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Você editou o texto à mão."
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-10 text-sm font-semibold text-primary",
						onClick: () => setCustom(selected, null),
						children: "Voltar ao texto automático"
					})]
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesFields, { date: selected })
		]
	});
}
function emptyTotals() {
	return {
		ramais: 0,
		tubos: 0,
		caixas: 0,
		prolongadores: 0,
		tampas: 0,
		aneis: 0,
		subleito: 0,
		subbase: 0,
		base: 0,
		meioFio: 0,
		preparo: 0,
		calcada: 0,
		demolicao: 0,
		caixaRua: 0,
		enchimentoSub: 0,
		cbuq: 0,
		soloM3: 0,
		soloM: 0,
		pisos: 0,
		rampas: 0,
		days: 0
	};
}
function addLine(t, line) {
	if (line.kind === "ramal" || line.kind === "caixa_ralo" || line.kind === "alteamento") {
		for (const p of line.pvs) {
			if (!p.code.trim()) continue;
			t.tubos += p.tubos || 0;
			t.prolongadores += p.prolongadores || 0;
			t.aneis += p.aneis || 0;
			if (line.kind === "ramal" && p.qty > 0) t.ramais += p.qty;
			if (line.kind === "caixa_ralo" && p.qty > 0) t.caixas += p.qty;
			if (line.kind === "alteamento") t.tampas += 1;
		}
		return;
	}
	if (line.qty <= 0) return;
	switch (line.kind) {
		case "regularizacao":
			t.subleito += line.qty;
			break;
		case "sub_base":
			t.subbase += line.qty;
			break;
		case "base":
			t.base += line.qty;
			break;
		case "meio_fio":
			t.meioFio += line.qty;
			break;
		case "preparo_calcada":
			t.preparo += line.qty;
			break;
		case "concretagem_calcada":
			t.calcada += line.qty;
			break;
		case "demolicao_calcada":
			t.demolicao += line.qty;
			break;
		case "enchimento_caixa":
			t.caixaRua += line.qty;
			break;
		case "enchimento_subbase":
			t.enchimentoSub += line.qty;
			break;
		case "cbuq":
			t.cbuq += line.qty;
			break;
		case "solo":
			if (line.soloUnit === "m") t.soloM += line.qty;
			else t.soloM3 += line.qty;
			break;
		case "piso_tatil":
			t.pisos += line.qty;
			t.rampas += line.rampas ?? 0;
	}
}
function lineMatches(line, street) {
	if (!street) return true;
	return streetKey(line.street) === streetKey(street);
}
function accumulate(days, street) {
	const t = emptyTotals();
	for (const day of days) {
		let hit = false;
		for (const front of day.fronts) for (const line of front.lines) {
			if (!lineMatches(line, street)) continue;
			const before = JSON.stringify(t);
			addLine(t, line);
			if (JSON.stringify(t) !== before) hit = true;
		}
		if (hit) t.days += 1;
	}
	return t;
}
function byStreet(days) {
	const names = /* @__PURE__ */ new Map();
	for (const day of days) for (const front of day.fronts) for (const line of front.lines) {
		const key = streetKey(line.street);
		if (!key) continue;
		if (!names.has(key)) names.set(key, streetName(line.street));
	}
	const rows = [];
	for (const [key, street] of names) rows.push({
		street,
		totals: accumulate(days, key)
	});
	rows.sort((a, b) => weight(b.totals) - weight(a.totals));
	return rows;
}
function weight(t) {
	return t.subleito + t.subbase + t.base + t.meioFio + t.calcada + t.preparo + t.cbuq + t.ramais * 10 + t.caixas * 10;
}
function statRows(t) {
	const rows = [];
	const add = (group, label, n, unit) => {
		if (n <= 0) return;
		rows.push({
			group,
			label,
			value: unit === "un" || unit === "pv" ? `${fmtNum(n)} ${unit}` : `${fmtNum(n)}${unit}`
		});
	};
	add("drenagem", "Ramais", t.ramais, "un");
	add("drenagem", "Caixas ralo", t.caixas, "un");
	add("drenagem", "Tampas alteadas", t.tampas, "pv");
	add("material", "Tubos de 400", t.tubos, "un");
	add("material", "Prolongadores", t.prolongadores, "un");
	add("material", "Anéis de concreto", t.aneis, "un");
	add("material", "CBUQ", t.cbuq, "t");
	add("pavimento", "Sub leito", t.subleito, "m");
	add("pavimento", "Sub base", t.subbase, "m");
	add("pavimento", "Base", t.base, "m");
	add("pavimento", "Meio fio", t.meioFio, "m");
	add("pavimento", "Caixa de rua", t.caixaRua, "m");
	add("pavimento", "Enchimento de sub base", t.enchimentoSub, "m");
	add("pavimento", "Preparo de calçada", t.preparo, "m");
	add("pavimento", "Calçada concretada", t.calcada, "m");
	add("pavimento", "Demolição de calçada", t.demolicao, "m");
	add("pavimento", "Solo borrachudo", t.soloM3, "m³");
	add("pavimento", "Solo borrachudo", t.soloM, "m");
	add("pavimento", "Pisos táteis", t.pisos, "un");
	add("pavimento", "Rampas com piso tátil", t.rampas, "un");
	return rows;
}
var GROUPS = [
	{
		id: "pavimento",
		title: "Pavimentação"
	},
	{
		id: "drenagem",
		title: "Drenagem"
	},
	{
		id: "material",
		title: "Materiais"
	}
];
function TotalsScreen() {
	const days = useDiario((s) => s.days);
	const list = (0, import_react.useMemo)(() => Object.values(days), [days]);
	const streets = (0, import_react.useMemo)(() => byStreet(list), [list]);
	const [street, setStreet] = (0, import_react.useState)(null);
	const totals = (0, import_react.useMemo)(() => accumulate(list, street ?? void 0), [list, street]);
	const rows = statRows(totals);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold tracking-tight text-ink",
				children: "Acumulado"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: totals.days === 0 ? "Nenhum lançamento neste filtro." : `${totals.days} ${totals.days === 1 ? "dia com produção" : "dias com produção"}${street ? ` · ${street}` : ""}`
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Rua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStreet(null),
					className: `h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${street == null ? "bg-ink text-paper" : "bg-paper text-ink"}`,
					children: "Todas"
				}), streets.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setStreet(row.street),
					className: `h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${street === row.street ? "bg-ink text-paper" : "bg-paper text-ink"}`,
					children: row.street
				}, row.street))]
			})] }),
			GROUPS.map((group) => {
				const items = rows.filter((r) => r.group === group.id);
				if (!items.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: group.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-paper p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-semibold tracking-tight text-ink",
							children: item.value
						})]
					}, `${item.label}-${item.value}`))
				})] }, group.id);
			}),
			streets.length > 0 && street == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "Por rua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: streets.map((row) => {
					const bits = statRows(row.totals).slice(0, 4).map((r) => `${r.label} ${r.value}`);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setStreet(row.street),
						className: "w-full rounded-2xl bg-paper p-4 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-ink",
							children: row.street
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: bits.join(" · ")
						})]
					}) }, row.street);
				})
			})] }) : null
		]
	});
}
var TABS = [
	{
		id: "dia",
		label: "Dia",
		icon: ClipboardList
	},
	{
		id: "texto",
		label: "Texto",
		icon: MessageSquareText
	},
	{
		id: "totais",
		label: "Totais",
		icon: ChartColumn
	},
	{
		id: "dias",
		label: "Dias",
		icon: CalendarDays
	}
];
function ProducaoApp() {
	const ready = useDiario((s) => s.ready);
	const [tab, setTab] = (0, import_react.useState)("dia");
	(0, import_react.useEffect)(() => {
		hydrateDiario();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "px-4 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-semibold leading-none",
				children: "Produção do dia"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "L449 · texto para o WhatsApp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-4 gap-1 rounded-xl bg-surface p-1",
				children: TABS.map((item) => {
					const Icon = item.icon;
					const active = tab === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(item.id),
						className: `flex h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-semibold ${active ? "bg-accent text-accent-fg" : "text-muted"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-4",
							"aria-hidden": true
						}), item.label]
					}, item.id);
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 pb-6 pt-4",
		children: !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-16 text-center text-base text-muted",
			children: "Abrindo o diário…"
		}) : tab === "dia" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayScreen, { onOpenText: (date) => {
			useDiario.getState().select(date);
			setTab("texto");
		} }) : tab === "texto" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextScreen, {}) : tab === "totais" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TotalsScreen, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DaysScreen, { onOpen: () => setTab("dia") })
	})] });
}
function ProducaoPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProducaoApp, {});
}
//#endregion
export { ProducaoPage as component };
