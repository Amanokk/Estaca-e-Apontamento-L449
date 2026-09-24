import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as cn } from "./utils-C8V_sHGQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BKnui5bz.js
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-md border border-border bg-surface px-3 text-base text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-20 w-full rounded-md border border-border bg-surface px-3 py-2 text-base text-fg placeholder:text-muted", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm font-medium text-muted", className),
		...props
	});
}
//#endregion
export { Label as n, Textarea as r, Input as t };
