import { useMemo } from "react";
import { formatBR, weekday } from "@/lib/producao/dates";
import { renderDay, renderFront } from "@/lib/producao/format";
import { useDiario } from "@/lib/producao/store";
import type { DayReport } from "@/lib/producao/types";

export function DaysScreen({ onOpen }: { onOpen: () => void }) {
  const days = useDiario((s) => s.days);
  const select = useDiario((s) => s.select);
  const list = useMemo(
    () => Object.values(days).sort((a, b) => b.date.localeCompare(a.date)),
    [days],
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">Dias</h2>
      <p className="mt-1 text-sm text-muted">Toque um dia para abrir e copiar de novo.</p>
      {list.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-paper p-6 text-base text-muted">Nenhum dia salvo ainda.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {list.map((day) => (
            <li key={day.date}>
              <button
                type="button"
                onClick={() => {
                  select(day.date);
                  onOpen();
                }}
                className="w-full rounded-2xl bg-paper p-4 text-left"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xl font-semibold text-ink">{formatBR(day.date)}</span>
                  <span className="text-sm capitalize text-muted">{weekday(day.date, true)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{summary(day)}</p>
                <p className="mt-2 truncate text-sm text-ink">{snippet(day)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function summary(day: DayReport): string {
  const dren = day.fronts.filter((f) => f.discipline === "drenagem" && renderFront(f)).length;
  const pav = day.fronts.filter((f) => f.discipline === "pavimentacao" && renderFront(f)).length;
  if (!dren && !pav) {
    if (day.recado.trim() || day.obs.trim()) return "Sem produção · tem recado";
    return "Dia vazio";
  }
  const bits = [
    dren ? `${dren} drenagem` : "",
    pav ? `${pav} pavimentação` : "",
    day.obs.trim() ? "com obs" : "",
  ].filter(Boolean);
  return bits.join(" · ");
}

function snippet(day: DayReport): string {
  const text = renderDay(day)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("Produção do dia"));
  return text[0] || day.recado.trim() || "—";
}
