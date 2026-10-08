import type { ActivityKind, Discipline } from "./types";

export const DEFAULT_STREETS = [
  "Visconde de Itaboraí",
  "João Caetano",
  "José Leandro",
  "Prefeito Augusto de Andrade",
  "Alberto Torres",
  "Ângelo Buriches",
  "Barão de Itapacorá",
];

export type ActivityMeta = {
  label: string;
  short: string;
  discipline: Discipline;
};

export const ACTIVITY_META: Record<ActivityKind, ActivityMeta> = {
  ramal: { label: "Ramal", short: "Ramal", discipline: "drenagem" },
  caixa_ralo: { label: "Caixa ralo", short: "Caixa ralo", discipline: "drenagem" },
  alteamento: { label: "Alteamento de tampa", short: "Alteamento", discipline: "drenagem" },
  demolicao_calcada: { label: "Demolição de calçada", short: "Demolição", discipline: "pavimentacao" },
  solo: { label: "Troca de solo borrachudo", short: "Solo borrachudo", discipline: "pavimentacao" },
  regularizacao: { label: "Regularização de sub leito", short: "Sub leito", discipline: "pavimentacao" },
  enchimento_caixa: { label: "Enchimento de caixa de rua", short: "Caixa de rua", discipline: "pavimentacao" },
  enchimento_subbase: { label: "Enchimento de sub base", short: "Ench. sub base", discipline: "pavimentacao" },
  sub_base: { label: "Execução de sub base", short: "Sub base", discipline: "pavimentacao" },
  base: { label: "Execução de base", short: "Base", discipline: "pavimentacao" },
  meio_fio: { label: "Concretagem de meio fio", short: "Meio fio", discipline: "pavimentacao" },
  preparo_calcada: { label: "Preparo de calçada", short: "Preparo calçada", discipline: "pavimentacao" },
  concretagem_calcada: { label: "Concretagem de calçada", short: "Calçada", discipline: "pavimentacao" },
  cbuq: { label: "Aplicação de CBUQ", short: "CBUQ", discipline: "pavimentacao" },
  piso_tatil: { label: "Piso tátil", short: "Piso tátil", discipline: "pavimentacao" },
};

export const PAVING_ORDER: ActivityKind[] = [
  "demolicao_calcada",
  "solo",
  "regularizacao",
  "enchimento_caixa",
  "enchimento_subbase",
  "sub_base",
  "base",
  "meio_fio",
  "preparo_calcada",
  "concretagem_calcada",
  "cbuq",
  "piso_tatil",
];

export const DRAIN_KINDS: ActivityKind[] = ["ramal", "caixa_ralo", "alteamento"];

export const OBS_CHIPS = [
  "Produção afetada por conta de tempo chuvoso",
  "Produção afetada por conta de solo saturado devido chuva",
  "Produção afetada por conta de solo saturado devido chuva do dia anterior",
  "Produção afetada por conta de solo saturado devido chuva do fim de semana",
  "Produção afetada — patrol quebrou",
];

export const RECADO_CHIPS = [
  "Falta de bica na obra",
  "Usina sem concreto",
  "Pá carregadeira da usina de concreto quebrou, por esse motivo não teve concreto",
  "Pedreira não está trazendo bica",
];

export function disciplineLabel(d: Discipline): string {
  return d === "drenagem" ? "Drenagem" : "Pavimentação";
}

export function appendNote(current: string, sentence: string): string {
  const c = current.trim();
  if (!c) return sentence;
  if (c.includes(sentence)) return c;
  const sep = /[.!?]$/.test(c) ? " " : ". ";
  return `${c}${sep}${sentence}`;
}

export function parseQty(raw: string): number {
  const t = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!t || t === ".") return 0;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

export function fmtNum(n: number): string {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}
