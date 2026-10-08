import { useEffect, useState } from "react";
import { CalendarDays, ChartColumn, ClipboardList, MessageSquareText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { hydrateDiario, useDiario } from "@/lib/producao/store";
import { DayScreen } from "./day-screen";
import { DaysScreen } from "./days-screen";
import { TextScreen } from "./text-screen";
import { TotalsScreen } from "./totals-screen";

type Tab = "dia" | "texto" | "totais" | "dias";

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: "dia", label: "Dia", icon: ClipboardList },
  { id: "texto", label: "Texto", icon: MessageSquareText },
  { id: "totais", label: "Totais", icon: ChartColumn },
  { id: "dias", label: "Dias", icon: CalendarDays },
];

export function ProducaoApp() {
  const ready = useDiario((s) => s.ready);
  const [tab, setTab] = useState<Tab>("dia");

  useEffect(() => {
    hydrateDiario();
  }, []);

  return (
    <AppShell>
      <header className="px-4 pt-4">
        <p className="text-lg font-semibold leading-none">Produção do dia</p>
        <p className="mt-1 text-sm text-muted">L449 · texto para o WhatsApp</p>
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-surface p-1">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex h-11 flex-col items-center justify-center gap-0.5 rounded-lg text-xs font-semibold ${
                  active ? "bg-accent text-accent-fg" : "text-muted"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>
      <main className="px-4 pb-6 pt-4">
        {!ready ? (
          <p className="py-16 text-center text-base text-muted">Abrindo o diário…</p>
        ) : tab === "dia" ? (
          <DayScreen
            onOpenText={(date) => {
              useDiario.getState().select(date);
              setTab("texto");
            }}
          />
        ) : tab === "texto" ? (
          <TextScreen />
        ) : tab === "totais" ? (
          <TotalsScreen />
        ) : (
          <DaysScreen onOpen={() => setTab("dia")} />
        )}
      </main>
    </AppShell>
  );
}
