import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Droplets, Plus, Route, Trash2 } from "lucide-react";
import { formatBR, shiftISO, weekday } from "@/lib/producao/dates";
import { frontHeading, lineSummary, renderFront } from "@/lib/producao/format";
import { useDiario } from "@/lib/producao/store";
import { emptyDay, type Discipline, type Line } from "@/lib/producao/types";
import { NotesFields } from "./notes";
import { PreviewCard } from "./preview-card";
import { ServiceSheet, type SheetState } from "./service-sheet";
import { Button, IconButton } from "./ui";

export function DayScreen({ onOpenText }: { onOpenText: (date: string) => void }) {
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
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const day = stored ?? emptyDay(selected);
  const dren = day.fronts.filter((f) => f.discipline === "drenagem");
  const pav = day.fronts.filter((f) => f.discipline === "pavimentacao");
  const empty = day.fronts.length === 0;

  const openNew = (discipline: Discipline) => {
    const id = addFront(selected, discipline);
    setSheet({ mode: "add", frontId: id, discipline });
  };

  const closeSheet = () => {
    if (sheet?.mode === "add") {
      const front = useDiario.getState().days[selected]?.fronts.find((f) => f.id === sheet.frontId);
      if (front && front.lines.length === 0) removeFront(selected, front.id);
    }
    setSheet(null);
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <IconButton aria-label="Dia anterior" onClick={() => { select(shiftISO(selected, -1)); setConfirmDelete(false); }}>
            <ChevronLeft className="size-6" />
          </IconButton>
          <div className="text-center">
            <p className="text-3xl font-semibold tracking-tight text-ink">{formatBR(selected)}</p>
            <p className="text-sm capitalize text-muted">
              {weekday(selected, true)} · {selected.slice(0, 4)}
            </p>
          </div>
          <IconButton aria-label="Próximo dia" onClick={() => { select(shiftISO(selected, 1)); setConfirmDelete(false); }}>
            <ChevronRight className="size-6" />
          </IconButton>
        </div>
        <label className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-muted">
          Ir para a data
          <input
            type="date"
            value={selected}
            onChange={(e) => { if (e.target.value) select(e.target.value); }}
            className="h-11 rounded-xl border border-line bg-paper px-3 text-base text-ink"
          />
        </label>

        {banner ? (
          <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
            <p className="text-sm leading-relaxed text-ink">
              Os relatos de 10/08 a 06/10 já estão em Dias, com chuva, bica e totais. Este dia está livre para lançar.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="h-10 rounded-xl bg-soft px-3 text-sm font-semibold text-ink" onClick={() => onOpenText("2026-08-10")}>
                Ver o texto de 10/08
              </button>
              <button type="button" className="h-10 rounded-xl px-3 text-sm font-semibold text-muted" onClick={dismissBanner}>
                Entendi
              </button>
            </div>
          </div>
        ) : null}

        {empty ? (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-surface px-4 py-8 text-center">
            <p className="text-xl font-semibold text-ink">Nada lançado em {formatBR(selected)}</p>
            <p className="mx-auto mt-2 max-w-sm text-base leading-relaxed text-muted">
              Abra a frente que trabalhou. O texto sai no formato da mensagem: Drenagem 1, Pavimentação 1, observação no fim.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="dren" onClick={() => openNew("drenagem")}>
                <Droplets className="size-5" /> Drenagem
              </Button>
              <Button onClick={() => openNew("pavimentacao")}>
                <Route className="size-5" /> Pavimentação
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {dren.map((front) => (
              <FrontCard
                key={front.id}
                heading={frontHeading(day, front)}
                tone="dren"
                canUp={dren[0]?.id !== front.id}
                canDown={dren[dren.length - 1]?.id !== front.id}
                onUp={() => moveFront(selected, front.id, -1)}
                onDown={() => moveFront(selected, front.id, 1)}
                onRemove={() => removeFront(selected, front.id)}
                onAdd={() => setSheet({ mode: "add", frontId: front.id, discipline: "drenagem" })}
                onEdit={(line) => setSheet({ mode: "edit", frontId: front.id, discipline: "drenagem", line })}
                onRemoveLine={(id) => removeLine(selected, front.id, id)}
                onMoveLine={(id, dir) => moveLine(selected, front.id, id, dir)}
                lines={front.lines}
                phrase={renderFront(front)}
              />
            ))}
            {pav.map((front) => (
              <FrontCard
                key={front.id}
                heading={frontHeading(day, front)}
                tone="pav"
                canUp={pav[0]?.id !== front.id}
                canDown={pav[pav.length - 1]?.id !== front.id}
                onUp={() => moveFront(selected, front.id, -1)}
                onDown={() => moveFront(selected, front.id, 1)}
                onRemove={() => removeFront(selected, front.id)}
                onAdd={() => setSheet({ mode: "add", frontId: front.id, discipline: "pavimentacao" })}
                onEdit={(line) => setSheet({ mode: "edit", frontId: front.id, discipline: "pavimentacao", line })}
                onRemoveLine={(id) => removeLine(selected, front.id, id)}
                onMoveLine={(id, dir) => moveLine(selected, front.id, id, dir)}
                lines={front.lines}
                phrase={renderFront(front)}
              />
            ))}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="line" className="flex-1" onClick={() => openNew("drenagem")}>
                <Plus className="size-5" /> Drenagem
              </Button>
              <Button variant="line" className="flex-1" onClick={() => openNew("pavimentacao")}>
                <Plus className="size-5" /> Pavimentação
              </Button>
            </div>
          </div>
        )}

        <NotesFields date={selected} />

        {stored ? (
          <div className="mt-6">
            {confirmDelete ? (
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" onClick={() => { removeDay(selected); setConfirmDelete(false); }}>
                  Apagar este dia
                </Button>
                <Button variant="line" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              </div>
            ) : (
              <button type="button" className="text-sm font-semibold text-muted" onClick={() => setConfirmDelete(true)}>
                Apagar lançamentos deste dia
              </button>
            )}
          </div>
        ) : null}

        <div className="mt-6 lg:hidden">
          <PreviewCard day={day} compact />
        </div>
      </div>

      <div className="sticky top-4 hidden lg:block">
        <PreviewCard day={day} />
      </div>

      <ServiceSheet date={selected} sheet={sheet} onClose={closeSheet} />
    </div>
  );
}

function FrontCard({
  heading,
  tone,
  lines,
  phrase,
  canUp,
  canDown,
  onUp,
  onDown,
  onRemove,
  onAdd,
  onEdit,
  onRemoveLine,
  onMoveLine,
}: {
  heading: string;
  tone: "dren" | "pav";
  lines: Line[];
  phrase: string;
  canUp: boolean;
  canDown: boolean;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  onAdd: () => void;
  onEdit: (line: Line) => void;
  onRemoveLine: (id: string) => void;
  onMoveLine: (id: string, dir: -1 | 1) => void;
}) {
  return (
    <article className={`rounded-3xl border border-line bg-paper p-4 ${tone === "dren" ? "border-l-4 border-l-dren" : "border-l-4 border-l-primary"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-ink">{heading}</h2>
          {phrase ? <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">{phrase}</p> : (
            <p className="mt-1 text-sm text-muted">Frente sem serviço.</p>
          )}
        </div>
        <div className="flex">
          <IconButton aria-label="Subir frente" disabled={!canUp} onClick={onUp}><ChevronUp className="size-5" /></IconButton>
          <IconButton aria-label="Descer frente" disabled={!canDown} onClick={onDown}><ChevronDown className="size-5" /></IconButton>
          <IconButton aria-label="Apagar frente" onClick={onRemove}><Trash2 className="size-5" /></IconButton>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {lines.map((line, index) => {
          const summary = lineSummary(line);
          return (
            <li key={line.id} className="flex items-center gap-1 rounded-2xl bg-surface px-2 py-1">
              <button type="button" onClick={() => onEdit(line)} className="min-w-0 flex-1 px-2 py-2 text-left">
                <p className="font-semibold text-ink">{summary.title}</p>
                <p className="truncate text-sm text-muted">{summary.detail}</p>
              </button>
              <IconButton aria-label="Subir serviço" disabled={index === 0} onClick={() => onMoveLine(line.id, -1)}>
                <ChevronUp className="size-4" />
              </IconButton>
              <IconButton aria-label="Descer serviço" disabled={index === lines.length - 1} onClick={() => onMoveLine(line.id, 1)}>
                <ChevronDown className="size-4" />
              </IconButton>
              <IconButton aria-label="Apagar serviço" onClick={() => onRemoveLine(line.id)}>
                <Trash2 className="size-4" />
              </IconButton>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onAdd} className="mt-3 inline-flex h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-ink">
        <Plus className="size-4" /> Serviço nesta frente
      </button>
    </article>
  );
}
