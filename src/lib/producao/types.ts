export type Discipline = "drenagem" | "pavimentacao";

export type ActivityKind =
  | "ramal"
  | "caixa_ralo"
  | "alteamento"
  | "demolicao_calcada"
  | "solo"
  | "regularizacao"
  | "enchimento_caixa"
  | "enchimento_subbase"
  | "sub_base"
  | "base"
  | "meio_fio"
  | "preparo_calcada"
  | "concretagem_calcada"
  | "cbuq"
  | "piso_tatil";

export type PvEntry = {
  id: string;
  code: string;
  qty: number;
  tubos: number;
  prolongadores: number;
  aneis: number;
};

export type Line = {
  id: string;
  kind: ActivityKind;
  street: string;
  qty: number;
  pvs: PvEntry[];
  semMetalon?: boolean;
  existente?: boolean;
  approx?: boolean;
  soloUnit?: "m3" | "m";
  soloPv?: string;
  rampas?: number;
};

export type Front = {
  id: string;
  discipline: Discipline;
  lines: Line[];
};

export type DayReport = {
  date: string;
  fronts: Front[];
  obs: string;
  recado: string;
  customText: string | null;
};

export function emptyDay(date: string): DayReport {
  return { date, fronts: [], obs: "", recado: "", customText: null };
}
