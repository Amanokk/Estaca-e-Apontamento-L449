import { useMemo, useState } from "react";
import { byStreet, statRows, accumulate, type StatRow } from "@/lib/producao/stats";
import { useDiario } from "@/lib/producao/store";
import { FieldLabel } from "./ui";

const GROUPS: { id: StatRow["group"]; title: string }[] = [
  { id: "pavimento", title: "Pavimentação" },
  { id: "drenagem", title: "Drenagem" },
  { id: "material", title: "Materiais" },
];

export function TotalsScreen() {
  const days = useDiario((s) => s.days);
  const list = useMemo(() => Object.values(days), [days]);
  const streets = useMemo(() => byStreet(list), [list]);
  const [street, setStreet] = useState<string | null>(null);
  const totals = useMemo(
    () => accumulate(list, street ?? undefined),
    [list, street],
  );
  const rows = statRows(totals);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Acumulado</h2>
        <p className="mt-1 text-sm text-muted">
          {totals.days === 0
            ? "Nenhum lançamento neste filtro."
            : `${totals.days} ${totals.days === 1 ? "dia com produção" : "dias com produção"}${street ? ` · ${street}` : ""}`}
        </p>
      </div>

      <div>
        <FieldLabel>Rua</FieldLabel>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setStreet(null)}
            className={`h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${street == null ? "bg-ink text-paper" : "bg-paper text-ink"}`}
          >
            Todas
          </button>
          {streets.map((row) => (
            <button
              key={row.street}
              type="button"
              onClick={() => setStreet(row.street)}
              className={`h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${street === row.street ? "bg-ink text-paper" : "bg-paper text-ink"}`}
            >
              {row.street}
            </button>
          ))}
        </div>
      </div>

      {GROUPS.map((group) => {
        const items = rows.filter((r) => r.group === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id}>
            <FieldLabel>{group.title}</FieldLabel>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {items.map((item) => (
                <div key={`${item.label}-${item.value}`} className="rounded-2xl bg-paper p-4">
                  <p className="text-sm text-muted">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {streets.length > 0 && street == null ? (
        <section>
          <FieldLabel>Por rua</FieldLabel>
          <ul className="mt-2 flex flex-col gap-2">
            {streets.map((row) => {
              const bits = statRows(row.totals).slice(0, 4).map((r) => `${r.label} ${r.value}`);
              return (
                <li key={row.street}>
                  <button
                    type="button"
                    onClick={() => setStreet(row.street)}
                    className="w-full rounded-2xl bg-paper p-4 text-left"
                  >
                    <p className="font-semibold text-ink">{row.street}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{bits.join(" · ")}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
