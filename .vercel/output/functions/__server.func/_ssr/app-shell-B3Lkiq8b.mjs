import { f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C8V_sHGQ.mjs";
import { A as CalendarDays, E as ClipboardList, g as MapPinned, x as Images } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-B3Lkiq8b.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Estacas",
		icon: MapPinned
	},
	{
		to: "/apontamento",
		label: "Apontar",
		icon: ClipboardList
	},
	{
		to: "/historico",
		label: "Histórico",
		icon: CalendarDays
	},
	{
		to: "/fotos",
		label: "Fotos",
		icon: Images
	}
];
function AppShell({ children, hideNav }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex min-h-0 flex-1 flex-col", hideNav ? "pb-0" : "pb-16"),
			children
		}), hideNav ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-1",
				children: NAV.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-xs font-medium transition-colors duration-150", active ? "text-accent" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							strokeWidth: active ? 2.4 : 1.8
						}), item.label]
					}, item.to);
				})
			})
		})]
	});
}
//#endregion
export { AppShell as t };
