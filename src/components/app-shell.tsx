import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Images, MapPinned } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Estacas", icon: MapPinned },
  { to: "/apontamento", label: "Apontar", icon: ClipboardList },
  { to: "/historico", label: "Histórico", icon: CalendarDays },
  { to: "/fotos", label: "Fotos", icon: Images },
] as const;

export function AppShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-bg text-fg">
      <div className={cn("flex min-h-0 flex-1 flex-col", hideNav ? "pb-0" : "pb-16")}>{children}</div>
      {hideNav ? null : (
        <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 backdrop-blur-md">
          <div className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-1">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-xs font-medium transition-colors duration-150",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
