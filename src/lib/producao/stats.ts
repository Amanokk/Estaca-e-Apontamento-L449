import { fmtNum } from "./catalog";
import { streetKey, streetName } from "./dates";
import type { DayReport, Line } from "./types";

export type Totals = {
  ramais: number;
  tubos: number;
  caixas: number;
  prolongadores: number;
  tampas: number;
  aneis: number;
  subleito: number;
  subbase: number;
  base: number;
  meioFio: number;
  preparo: number;
  calcada: number;
  demolicao: number;
  caixaRua: number;
  enchimentoSub: number;
  cbuq: number;
  soloM3: number;
  soloM: number;
  pisos: number;
  rampas: number;
  days: number;
};

export function emptyTotals(): Totals {
  return {
    ramais: 0,
    tubos: 0,
    caixas: 0,
    prolongadores: 0,
    tampas: 0,
    aneis: 0,
    subleito: 0,
    subbase: 0,
    base: 0,
    meioFio: 0,
    preparo: 0,
    calcada: 0,
    demolicao: 0,
    caixaRua: 0,
    enchimentoSub: 0,
    cbuq: 0,
    soloM3: 0,
    soloM: 0,
    pisos: 0,
    rampas: 0,
    days: 0,
  };
}

function addLine(t: Totals, line: Line) {
  if (line.kind === "ramal" || line.kind === "caixa_ralo" || line.kind === "alteamento") {
    for (const p of line.pvs) {
      if (!p.code.trim()) continue;
      t.tubos += p.tubos || 0;
      t.prolongadores += p.prolongadores || 0;
      t.aneis += p.aneis || 0;
      if (line.kind === "ramal" && p.qty > 0) t.ramais += p.qty;
      if (line.kind === "caixa_ralo" && p.qty > 0) t.caixas += p.qty;
      if (line.kind === "alteamento") t.tampas += 1;
    }
    return;
  }
  if (line.qty <= 0) return;
  switch (line.kind) {
    case "regularizacao":
      t.subleito += line.qty;
      break;
    case "sub_base":
      t.subbase += line.qty;
      break;
    case "base":
      t.base += line.qty;
      break;
    case "meio_fio":
      t.meioFio += line.qty;
      break;
    case "preparo_calcada":
      t.preparo += line.qty;
      break;
    case "concretagem_calcada":
      t.calcada += line.qty;
      break;
    case "demolicao_calcada":
      t.demolicao += line.qty;
      break;
    case "enchimento_caixa":
      t.caixaRua += line.qty;
      break;
    case "enchimento_subbase":
      t.enchimentoSub += line.qty;
      break;
    case "cbuq":
      t.cbuq += line.qty;
      break;
    case "solo":
      if (line.soloUnit === "m") t.soloM += line.qty;
      else t.soloM3 += line.qty;
      break;
    case "piso_tatil":
      t.pisos += line.qty;
      t.rampas += line.rampas ?? 0;
      break;
    default:
      break;
  }
}

function lineMatches(line: Line, street?: string): boolean {
  if (!street) return true;
  return streetKey(line.street) === streetKey(street);
}

export function accumulate(days: DayReport[], street?: string): Totals {
  const t = emptyTotals();
  for (const day of days) {
    let hit = false;
    for (const front of day.fronts) {
      for (const line of front.lines) {
        if (!lineMatches(line, street)) continue;
        const before = JSON.stringify(t);
        addLine(t, line);
        if (JSON.stringify(t) !== before) hit = true;
      }
    }
    if (hit) t.days += 1;
  }
  return t;
}

export type StreetRollup = { street: string; totals: Totals };

export function byStreet(days: DayReport[]): StreetRollup[] {
  const names = new Map<string, string>();
  for (const day of days) {
    for (const front of day.fronts) {
      for (const line of front.lines) {
        const key = streetKey(line.street);
        if (!key) continue;
        if (!names.has(key)) names.set(key, streetName(line.street));
      }
    }
  }
  const rows: StreetRollup[] = [];
  for (const [key, street] of names) {
    rows.push({ street, totals: accumulate(days, key) });
  }
  rows.sort((a, b) => weight(b.totals) - weight(a.totals));
  return rows;
}

function weight(t: Totals): number {
  return (
    t.subleito +
    t.subbase +
    t.base +
    t.meioFio +
    t.calcada +
    t.preparo +
    t.cbuq +
    t.ramais * 10 +
    t.caixas * 10
  );
}

export type StatRow = { label: string; value: string; group: "drenagem" | "pavimento" | "material" };

export function statRows(t: Totals): StatRow[] {
  const rows: StatRow[] = [];
  const add = (group: StatRow["group"], label: string, n: number, unit: string) => {
    if (n <= 0) return;
    rows.push({ group, label, value: unit === "un" || unit === "pv" ? `${fmtNum(n)} ${unit}` : `${fmtNum(n)}${unit}` });
  };
  add("drenagem", "Ramais", t.ramais, "un");
  add("drenagem", "Caixas ralo", t.caixas, "un");
  add("drenagem", "Tampas alteadas", t.tampas, "pv");
  add("material", "Tubos de 400", t.tubos, "un");
  add("material", "Prolongadores", t.prolongadores, "un");
  add("material", "Anéis de concreto", t.aneis, "un");
  add("material", "CBUQ", t.cbuq, "t");
  add("pavimento", "Sub leito", t.subleito, "m");
  add("pavimento", "Sub base", t.subbase, "m");
  add("pavimento", "Base", t.base, "m");
  add("pavimento", "Meio fio", t.meioFio, "m");
  add("pavimento", "Caixa de rua", t.caixaRua, "m");
  add("pavimento", "Enchimento de sub base", t.enchimentoSub, "m");
  add("pavimento", "Preparo de calçada", t.preparo, "m");
  add("pavimento", "Calçada concretada", t.calcada, "m");
  add("pavimento", "Demolição de calçada", t.demolicao, "m");
  add("pavimento", "Solo borrachudo", t.soloM3, "m³");
  add("pavimento", "Solo borrachudo", t.soloM, "m");
  add("pavimento", "Pisos táteis", t.pisos, "un");
  add("pavimento", "Rampas com piso tátil", t.rampas, "un");
  return rows;
}
