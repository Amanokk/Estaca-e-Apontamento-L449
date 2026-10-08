import { OBS_CHIPS, RECADO_CHIPS, appendNote } from "@/lib/producao/catalog";
import { useDiario } from "@/lib/producao/store";
import { FieldLabel } from "./ui";

export function NotesFields({ date }: { date: string }) {
  const obs = useDiario((s) => s.days[date]?.obs ?? "");
  const recado = useDiario((s) => s.days[date]?.recado ?? "");
  const setObs = useDiario((s) => s.setObs);
  const setRecado = useDiario((s) => s.setRecado);

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div>
        <FieldLabel>Observação no texto</FieldLabel>
        <textarea
          value={obs}
          onChange={(e) => setObs(date, e.target.value)}
          rows={3}
          placeholder="Produção afetada por conta de..."
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
        />
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {OBS_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setObs(date, appendNote(obs, chip))}
              className="h-10 shrink-0 rounded-full bg-soft px-3 text-sm font-medium text-ink"
            >
              {chip.replace("Produção afetada por conta de ", "").replace("Produção afetada — ", "")}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Recado separado</FieldLabel>
        <p className="mt-1 text-sm text-muted">Chuva, bica, usina, máquina — não entra no texto da produção.</p>
        <textarea
          value={recado}
          onChange={(e) => setRecado(date, e.target.value)}
          rows={3}
          placeholder="Falta de bica na obra"
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
        />
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {RECADO_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setRecado(date, appendNote(recado, chip))}
              className="h-10 shrink-0 rounded-full bg-soft px-3 text-sm font-medium text-ink"
            >
              {chip.length > 42 ? `${chip.slice(0, 40)}…` : chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
