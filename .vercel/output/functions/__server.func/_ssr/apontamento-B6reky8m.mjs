import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as formatDuration, l as todayISO, o as minutesBetween, r as formatDateBR, s as nowHHMM } from "./utils-C8V_sHGQ.mjs";
import { T as Clock, p as Plus, s as Square } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-B3Lkiq8b.mjs";
import { d as loadLast, t as Button, v as useCloseApontamento, w as useSnapshot } from "./use-snapshot-C57aYS-J.mjs";
import { n as openForEquipment } from "./crew-BAt7bSVX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apontamento-B6reky8m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const { data } = useSnapshot(void 0, true);
	const closeMut = useCloseApontamento();
	const [tick, setTick] = (0, import_react.useState)(nowHHMM());
	const last = loadLast();
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setTick(nowHHMM()), 3e4);
		return () => clearInterval(id);
	}, []);
	const today = todayISO();
	const rows = (0, import_react.useMemo)(() => (data?.apontamentos ?? []).filter((a) => a.date === today).sort((a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt)), [data?.apontamentos, today]);
	const open = (data?.apontamentos ?? []).filter((a) => !a.end);
	const myOpen = openForEquipment(open, last.equipmentId) ?? open[0];
	const hours = rows.reduce((acc, a) => acc + minutesBetween(a.start, a.end ?? tick), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "px-4 pb-2 pt-[max(16px,env(safe-area-inset-top))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-widest text-muted",
				children: "Apontamento"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold leading-none text-fg",
				children: formatDateBR(today)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `text-xs font-semibold ${data?.live ? "text-ok" : "text-muted"}`,
					children: data?.live ? "Save global" : "Só neste aparelho"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm tabular-nums text-muted",
					children: [
						rows.length,
						" · ",
						formatDuration(hours)
					]
				})]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 flex-col gap-4 px-4 pb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/novo",
				className: "flex min-h-14 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-semibold text-accent-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" }), myOpen ? "Atualizar atividade" : "Nova atividade"]
			}),
			open.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-ok/25 bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium uppercase tracking-wide text-ok",
					children: "Em andamento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: open.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-lg bg-ok-fg/40 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 text-left",
							onClick: () => void navigate({
								to: "/novo",
								search: { edit: a.id }
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold text-fg",
								children: a.equipmentName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-ok",
								children: [
									a.activityName,
									" · desde ",
									a.start,
									a.streetName ? ` · ${a.streetName.replace(/^Rua /, "")}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								closeMut.mutate({
									id: a.id,
									end: nowHHMM()
								});
								toast.success("Atividade encerrada");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "Encerrar"]
						})]
					}, a.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 font-display text-lg font-semibold",
				children: "Do dia"
			}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mx-auto mb-2 size-6 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nenhuma atividade ainda. Toque em Nova atividade para começar."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-2",
				children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/novo",
					search: { edit: a.id },
					className: "block rounded-xl border border-border bg-surface p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-sm tabular-nums text-muted",
								children: [a.start, a.end ? `–${a.end}` : "–…"]
							}), !a.end ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-ok-fg px-2 py-0.5 text-xs font-medium text-ok",
								children: "andamento"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-semibold",
							children: a.equipmentName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								a.activityName,
								a.streetName ? ` · ${a.streetName.replace(/^Rua /, "")}` : "",
								a.estaca ? ` · E ${a.estaca}` : ""
							]
						})
					]
				}) }, a.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cadastros",
						className: "text-accent",
						children: "Cadastros"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/relatorio",
						className: "text-accent",
						children: "Relatório"
					})
				]
			})
		]
	})] });
}
//#endregion
export { Home as component };
