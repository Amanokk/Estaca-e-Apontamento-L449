import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  ACTIVITY_META,
  DRAIN_KINDS,
  PAVING_ORDER,
} from "@/lib/producao/catalog";
import { streetKey, streetName } from "@/lib/producao/dates";
import { renderFront } from "@/lib/producao/format";
import { newId, useDiario } from "@/lib/producao/store";
import type { ActivityKind, Discipline, Front, Line, PvEntry } from "@/lib/producao/types";
import { Button, FieldLabel, Stepper } from "./ui";

type PvDraft = {
  id: string;
  code: string;
  qty: number;
  tubos: number;
  prolongadores: number;
  aneis: number;
};

export type SheetState =
  | { mode: "add"; frontId: string; discipline: Discipline }
  | { mode: "edit"; frontId: string; discipline: Discipline; line: Line };

function blankPv(): PvDraft {
  return { id: newId("pv"), code: "", qty: 1, tubos: 0, prolongadores: 0, aneis: 0 };
}

function pvFromEntry(p: PvEntry): PvDraft {
  return {
    id: p.id,
    code: p.code,
    qty: p.qty || 1,
    tubos: p.tubos || 0,
    prolongadores: p.prolongadores || 0,
    aneis: p.aneis || 0,
  };
}

export function ServiceSheet({
  date,
  sheet,
  onClose,
}: {
  date: string;
  sheet: SheetState | null;
  onClose: () => void;
}) {
  const streets = useDiario((s) => s.streets);
  const days = useDiario((s) => s.days);
  const codes = useMemo(() => collectCodes(days), [days]);
  const addLines = useDiario((s) => s.addLines);
  const replaceLine = useDiario((s) => s.replaceLine);
  const rememberStreet = useDiario((s) => s.rememberStreet);

  const open = sheet != null;
  const discipline = sheet?.discipline ?? "pavimentacao";
  const editing = sheet?.mode === "edit" ? sheet.line : null;

  const [kind, setKind] = useState<ActivityKind>("ramal");
  const [street, setStreet] = useState("");
  const [pvs, setPvs] = useState<PvDraft[]>([blankPv()]);
  const [qty, setQty] = useState<Partial<Record<ActivityKind, number>>>({});
  const [semMetalon, setSemMetalon] = useState(false);
  const [existente, setExistente] = useState(false);
  const [approx, setApprox] = useState(true);
  const [soloUnit, setSoloUnit] = useState<"m3" | "m">("m3");
  const [soloPv, setSoloPv] = useState("");
  const [rampas, setRampas] = useState(0);
  const [error, setError] = useState("");
  const sheetKey = !sheet ? "" : sheet.mode === "edit" ? `e-${sheet.line.id}` : `a-${sheet.frontId}-${sheet.discipline}`;
  const [seenKey, setSeenKey] = useState(sheetKey);

  if (seenKey !== sheetKey) {
    setSeenKey(sheetKey);
    setError("");
    if (sheet?.mode === "edit") {
      const line = sheet.line;
      setKind(line.kind);
      setStreet(line.street);
      setPvs(line.pvs.length ? line.pvs.map(pvFromEntry) : [blankPv()]);
      setQty({ [line.kind]: line.qty });
      setSemMetalon(Boolean(line.semMetalon));
      setExistente(Boolean(line.existente));
      setApprox(line.approx !== false);
      setSoloUnit(line.soloUnit === "m" ? "m" : "m3");
      setSoloPv(line.soloPv ?? "");
      setRampas(line.rampas ?? 0);
    } else if (sheet) {
      setKind(sheet.discipline === "drenagem" ? "ramal" : "regularizacao");
      setStreet("");
      setPvs([blankPv()]);
      setQty({});
      setSemMetalon(false);
      setExistente(false);
      setApprox(true);
      setSoloUnit("m3");
      setSoloPv("");
      setRampas(0);
    }
  }

  const pavingKinds = editing && discipline === "pavimentacao" ? [editing.kind] : PAVING_ORDER;

  const draftLines = useMemo(() => {
    if (!sheet || !streetName(street)) return [] as Line[];
    if (discipline === "drenagem") {
      return [
        {
          id: editing?.id ?? "draft",
          kind,
          street,
          qty: 0,
          pvs: pvs.map((p) => ({
            id: p.id,
            code: p.code.trim(),
            qty: kind === "alteamento" ? 1 : p.qty,
            tubos: kind === "alteamento" ? 0 : p.tubos,
            prolongadores: kind === "alteamento" ? 0 : p.prolongadores,
            aneis: kind === "alteamento" ? p.aneis : 0,
          })),
        } satisfies Line,
      ];
    }
    return pavingKinds
      .map((k) => toPavingLine(k, street, qty[k] ?? 0, editing?.id ?? `draft-${k}`, {
        semMetalon,
        existente,
        approx,
        soloUnit,
        soloPv,
        rampas,
      }))
      .filter((l): l is Line => l != null);
  }, [sheet, street, discipline, kind, pvs, pavingKinds, qty, editing?.id, semMetalon, existente, approx, soloUnit, soloPv, rampas]);

  const phrase = useMemo(() => {
    const front: Front = { id: "draft", discipline, lines: draftLines };
    return renderFront(front);
  }, [draftLines, discipline]);

  const save = (another: boolean) => {
    if (!sheet) return;
    if (!streetName(street)) {
      setError("Escolha a rua.");
      return;
    }
    if (!draftLines.length || !renderFront({ id: "x", discipline, lines: draftLines })) {
      setError(discipline === "drenagem" ? "Informe o PV e a quantidade." : "Informe ao menos uma quantidade.");
      return;
    }
    rememberStreet(street);
    if (sheet.mode === "edit") {
      const line = draftLines[0];
      if (line) replaceLine(date, sheet.frontId, line);
      onClose();
      return;
    }
    addLines(date, sheet.frontId, draftLines.map((l) => ({ ...l, id: newId("ln"), pvs: l.pvs.map((p) => ({ ...p, id: p.id || newId("pv") })) })));
    if (another) {
      setStreet("");
      setQty({});
      setPvs([blankPv()]);
      setSoloPv("");
      setRampas(0);
      setError("");
      return;
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col rounded-t-3xl bg-paper shadow-2xl outline-none lg:inset-x-auto lg:bottom-16 lg:left-1/2 lg:top-16 lg:w-full lg:max-w-xl lg:-translate-x-1/2 lg:rounded-3xl">
          <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
            <div>
              <Dialog.Title className="text-lg font-semibold text-ink">
                {editing ? "Editar serviço" : discipline === "drenagem" ? "Serviço de drenagem" : "Serviço de pavimentação"}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted">
                A frase do WhatsApp se monta aqui embaixo.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink hover:bg-soft"
              aria-label="Fechar"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {discipline === "drenagem" ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {DRAIN_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`h-11 rounded-xl px-3 text-sm font-semibold ${kind === k ? "bg-dren text-dren-fg" : "bg-soft text-ink"}`}
                  >
                    {ACTIVITY_META[k].short}
                  </button>
                ))}
              </div>
            ) : null}

            <FieldLabel>Rua</FieldLabel>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {streets.map((name) => {
                const on = streetKey(name) === streetKey(street) && streetName(street).length > 0;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setStreet(name)}
                    className={`h-11 shrink-0 rounded-xl px-3 text-sm font-semibold ${on ? "bg-ink text-paper" : "bg-soft text-ink"}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <input
              value={streets.some((s) => streetKey(s) === streetKey(street)) ? "" : street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Outra rua"
              className="mt-1 h-12 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink outline-none focus:border-primary"
            />

            {discipline === "drenagem" ? (
              <div className="mt-5">
                <FieldLabel>{kind === "alteamento" ? "PVs" : kind === "ramal" ? "Ramais por PV" : "Caixas por PV"}</FieldLabel>
                <datalist id="pv-codes">
                  {codes.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="mt-2 flex flex-col gap-3">
                  {pvs.map((row, index) => (
                    <div key={row.id} className="rounded-2xl border border-line bg-surface p-3">
                      <div className="flex items-center gap-2">
                        <input
                          list="pv-codes"
                          value={row.code}
                          onChange={(e) => updatePv(setPvs, row.id, { code: e.target.value })}
                          placeholder="PV D12"
                          aria-label={`Código do PV ${index + 1}`}
                          className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 text-base font-semibold text-ink outline-none focus:border-primary"
                        />
                        {pvs.length > 1 ? (
                          <button
                            type="button"
                            className="h-12 rounded-xl px-3 text-sm font-semibold text-muted"
                            onClick={() => setPvs((rows) => rows.filter((r) => r.id !== row.id))}
                          >
                            Tirar
                          </button>
                        ) : null}
                      </div>
                      {kind !== "alteamento" ? (
                        <QtyLine label={kind === "ramal" ? "Quantidade" : "Caixas"} value={row.qty} onChange={(n) => updatePv(setPvs, row.id, { qty: n })} />
                      ) : null}
                      {kind === "ramal" || kind === "caixa_ralo" ? (
                        <QtyLine label="Tubos de 400" value={row.tubos} onChange={(n) => updatePv(setPvs, row.id, { tubos: n })} />
                      ) : null}
                      {kind === "ramal" || kind === "caixa_ralo" ? (
                        <QtyLine label="Prolongadores" value={row.prolongadores} onChange={(n) => updatePv(setPvs, row.id, { prolongadores: n })} />
                      ) : null}
                      {kind === "alteamento" ? (
                        <QtyLine label="Anéis de concreto" value={row.aneis} onChange={(n) => updatePv(setPvs, row.id, { aneis: n })} />
                      ) : null}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 h-11 rounded-xl bg-soft px-3 text-sm font-semibold text-ink"
                  onClick={() => setPvs((rows) => [...rows, blankPv()])}
                >
                  Outro PV
                </button>
              </div>
            ) : (
              <div className="mt-5 flex flex-col">
                {pavingKinds.map((k) => (
                  <div key={k} className="flex items-start justify-between gap-3 border-b border-line py-3">
                    <div className="min-w-0 pt-2">
                      <p className="font-medium text-ink">{ACTIVITY_META[k].label}</p>
                      {k === "preparo_calcada" ? (
                        <Check label="Sem metalon" checked={semMetalon} onChange={setSemMetalon} />
                      ) : null}
                      {k === "demolicao_calcada" ? (
                        <Check label="Calçada existente" checked={existente} onChange={setExistente} />
                      ) : null}
                      {k === "cbuq" ? (
                        <Check label="Aproximadamente" checked={approx} onChange={setApprox} />
                      ) : null}
                      {k === "solo" ? (
                        <div className="mt-2 flex gap-2">
                          {(["m3", "m"] as const).map((u) => (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setSoloUnit(u)}
                              className={`h-9 rounded-lg px-3 text-sm font-semibold ${soloUnit === u ? "bg-ink text-paper" : "bg-soft text-ink"}`}
                            >
                              {u === "m3" ? "m³" : "m"}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      {k === "solo" ? (
                        <input
                          value={soloPv}
                          onChange={(e) => setSoloPv(e.target.value)}
                          placeholder="PV, se houver"
                          className="mt-2 h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink outline-none focus:border-primary"
                        />
                      ) : null}
                      {k === "piso_tatil" ? (
                        <div className="mt-2">
                          <p className="text-sm text-muted">Rampas</p>
                          <Stepper label="Rampas" value={rampas} onChange={setRampas} />
                        </div>
                      ) : null}
                    </div>
                    <Stepper
                      label={ACTIVITY_META[k].label}
                      value={qty[k] ?? 0}
                      blankZero
                      quick={k !== "piso_tatil" && k !== "solo" && k !== "cbuq"}
                      onChange={(n) => setQty((q) => ({ ...q, [k]: n }))}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-soft p-4">
              <FieldLabel>Frase</FieldLabel>
              <p className="mt-2 text-base leading-relaxed text-ink">
                {phrase || "Preencha a rua e as quantidades."}
              </p>
            </div>
            {error ? <p className="mt-3 text-sm font-semibold text-primary">{error}</p> : null}
          </div>

          <div className="flex flex-col gap-2 border-t border-line p-4 sm:flex-row">
            {sheet?.mode === "add" ? (
              <Button variant="line" className="sm:flex-1" onClick={() => save(true)}>
                Salvar e outra rua
              </Button>
            ) : null}
            <Button variant={discipline === "drenagem" ? "dren" : "primary"} className="sm:flex-1" onClick={() => save(false)}>
              Salvar na frente
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function QtyLine({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-ink">{label}</p>
      <Stepper label={label} value={value} onChange={onChange} />
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-2 flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-primary" />
      {label}
    </label>
  );
}

function updatePv(setPvs: Dispatch<SetStateAction<PvDraft[]>>, id: string, patch: Partial<PvDraft>) {
  setPvs((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

function toPavingLine(
  kind: ActivityKind,
  street: string,
  amount: number,
  id: string,
  flags: {
    semMetalon: boolean;
    existente: boolean;
    approx: boolean;
    soloUnit: "m3" | "m";
    soloPv: string;
    rampas: number;
  },
): Line | null {
  if (amount <= 0) return null;
  return {
    id,
    kind,
    street,
    qty: amount,
    pvs: [],
    semMetalon: kind === "preparo_calcada" ? flags.semMetalon : undefined,
    existente: kind === "demolicao_calcada" ? flags.existente : undefined,
    approx: kind === "cbuq" ? flags.approx : undefined,
    soloUnit: kind === "solo" ? flags.soloUnit : undefined,
    soloPv: kind === "solo" ? flags.soloPv.trim() : undefined,
    rampas: kind === "piso_tatil" ? flags.rampas : undefined,
  };
}

function collectCodes(days: Record<string, { fronts: { lines: Line[] }[] }>): string[] {
  const set = new Set<string>();
  for (const day of Object.values(days)) {
    for (const front of day.fronts) {
      for (const line of front.lines) {
        for (const pv of line.pvs) if (pv.code.trim()) set.add(pv.code.trim());
        if (line.soloPv?.trim()) set.add(line.soloPv.trim());
      }
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
