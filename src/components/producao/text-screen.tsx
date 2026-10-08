import { formatBR, weekday } from "@/lib/producao/dates";
import { renderDay } from "@/lib/producao/format";
import { useDiario } from "@/lib/producao/store";
import { emptyDay } from "@/lib/producao/types";
import { NotesFields } from "./notes";
import { PreviewCard } from "./preview-card";
import { FieldLabel } from "./ui";

export function TextScreen() {
  const selected = useDiario((s) => s.selected);
  const stored = useDiario((s) => s.days[selected]);
  const setCustom = useDiario((s) => s.setCustom);
  const day = stored ?? emptyDay(selected);
  const generated = renderDay(day);
  const edited = day.customText != null && day.customText !== generated;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Texto de {formatBR(selected)}</h2>
        <p className="text-sm capitalize text-muted">{weekday(selected, true)}</p>
      </div>
      <PreviewCard day={day} />
      <div>
        <FieldLabel>Ajuste fino</FieldLabel>
        <p className="mt-1 text-sm text-muted">
          O texto acima segue os lançamentos. Se mudar uma palavra aqui, a cópia usa a sua versão.
        </p>
        <textarea
          value={day.customText ?? generated}
          onChange={(e) => setCustom(selected, e.target.value)}
          rows={14}
          aria-label="Texto da produção"
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none focus:border-primary"
        />
        {day.customText != null ? (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {edited ? <p className="text-sm text-muted">Você editou o texto à mão.</p> : null}
            <button type="button" className="h-10 text-sm font-semibold text-primary" onClick={() => setCustom(selected, null)}>
              Voltar ao texto automático
            </button>
          </div>
        ) : null}
      </div>
      <NotesFields date={selected} />
    </div>
  );
}
