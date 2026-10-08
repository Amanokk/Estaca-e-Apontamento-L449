import type { ActivityKind, DayReport, Front, Line, PvEntry } from "./types";

const VIS = "Visconde de Itaboraí";
const JOA = "João Caetano";
const JOS = "José Leandro";
const PRE = "Prefeito Augusto de Andrade";
const ALB = "Alberto Torres";
const ANG = "Ângelo Buriches";
const BAR = "Barão de Itapacorá";

function pv(id: string, code: string, qty: number, tubos = 0, pro = 0, aneis = 0): PvEntry {
  return { id, code, qty, tubos, prolongadores: pro, aneis };
}

function dren(id: string, kind: "ramal" | "caixa_ralo" | "alteamento", street: string, pvs: PvEntry[]): Line {
  return { id, kind, street, qty: 0, pvs, rampas: 0, soloUnit: "m3" };
}

function pav(id: string, kind: ActivityKind, street: string, qty: number, extra: Partial<Line> = {}): Line {
  return {
    id,
    kind,
    street,
    qty,
    pvs: [],
    rampas: extra.rampas ?? 0,
    soloUnit: extra.soloUnit ?? "m3",
    approx: kind === "cbuq" ? extra.approx !== false : extra.approx,
    semMetalon: extra.semMetalon,
    existente: extra.existente,
    soloPv: extra.soloPv,
  };
}

function front(id: string, discipline: Front["discipline"], lines: Line[]): Front {
  return { id, discipline, lines };
}

function day(date: string, fronts: Front[], obs = "", recado = ""): DayReport {
  return { date, fronts, obs, recado, customText: null };
}

export function seedDays(): Record<string, DayReport> {
  const list: DayReport[] = [
    day("2026-08-10", [
      front("d1008-1", "drenagem", [
        dren("d1008-1a", "ramal", VIS, [
          pv("d1008-p1", "PV D11", 1, 3),
          pv("d1008-p2", "PV D12", 1, 2),
        ]),
      ]),
      front("d1008-2", "drenagem", [
        dren("d1008-2a", "caixa_ralo", JOA, [
          pv("d1008-p3", "PV C34", 1, 0, 2),
          pv("d1008-p4", "PV C36", 1, 0, 3),
          pv("d1008-p5", "PV C37", 1),
        ]),
      ]),
      front("d1008-3", "drenagem", [
        dren("d1008-3a", "alteamento", JOA, [
          pv("d1008-p6", "PV C35", 1, 0, 0, 3),
          pv("d1008-p7", "PV C36", 1, 0, 0, 3),
          pv("d1008-p8", "PV C37", 1, 0, 0, 3),
          pv("d1008-p9", "PV C38", 1, 0, 0, 2),
        ]),
      ]),
      front("d1008-4", "pavimentacao", [
        pav("d1008-4a", "regularizacao", VIS, 270),
        pav("d1008-4b", "sub_base", VIS, 180),
        pav("d1008-4c", "meio_fio", JOA, 70),
      ]),
      front("d1008-5", "pavimentacao", [
        pav("d1008-5a", "preparo_calcada", JOS, 70),
        pav("d1008-5b", "concretagem_calcada", JOS, 60),
      ]),
    ], "", "Dia 10/08 tempo chuvoso — 2 carros de concreto na parte da manhã, usina sem concreto depois do almoço."),

    day("2026-08-11", [], "", "Dia chuvoso — usina sem concreto até as 11h. Falta de bica na obra, pedreira não está trazendo bica."),

    day("2026-08-12", [
      front("d1208-1", "drenagem", [
        dren("d1208-1a", "ramal", VIS, [
          pv("d1208-p1", "PV D12", 1, 2),
          pv("d1208-p2", "PV D13", 2, 5),
          pv("d1208-p3", "PV D14", 2, 5),
        ]),
      ]),
      front("d1208-2", "drenagem", [
        dren("d1208-2a", "caixa_ralo", JOA, [
          pv("d1208-p4", "PV C34", 1, 0, 2),
          pv("d1208-p5", "PV C35", 2, 2, 2),
          pv("d1208-p6", "PV C36", 1, 0, 2),
          pv("d1208-p7", "PV C37", 1, 0, 1),
          pv("d1208-p8", "PV C38", 2, 1, 3),
        ]),
      ]),
      front("d1208-3", "pavimentacao", [pav("d1208-3a", "regularizacao", PRE, 90)]),
      front("d1208-4", "pavimentacao", [
        pav("d1208-4a", "regularizacao", VIS, 180),
        pav("d1208-4b", "sub_base", VIS, 250),
      ]),
    ], "Produção afetada por conta de tempo chuvoso", "Continua a falta de bica na obra, mesmo chegando alguns carros."),

    day("2026-08-13", [
      front("d1308-1", "drenagem", [
        dren("d1308-1a", "caixa_ralo", VIS, [
          pv("d1308-p1", "PV D1", 2, 0, 2),
          pv("d1308-p2", "PV D2", 3, 0, 4),
        ]),
      ]),
      front("d1308-2", "drenagem", [
        dren("d1308-2a", "alteamento", JOA, [
          pv("d1308-p3", "PV C32", 1),
          pv("d1308-p4", "PV C33", 1),
        ]),
      ]),
      front("d1308-3", "pavimentacao", [
        pav("d1308-3a", "sub_base", VIS, 90),
        pav("d1308-3b", "meio_fio", VIS, 148),
        pav("d1308-3c", "enchimento_caixa", JOA, 90),
        pav("d1308-3d", "base", JOA, 130),
      ]),
      front("d1308-4", "pavimentacao", [pav("d1308-4a", "concretagem_calcada", JOS, 65)]),
    ]),

    day("2026-08-14", [
      front("d1408-1", "drenagem", [
        dren("d1408-1a", "alteamento", JOA, [
          pv("d1408-p1", "PV C34", 1),
          pv("d1408-p2", "PV C35", 1),
          pv("d1408-p3", "PV C36", 1),
          pv("d1408-p4", "PV C37", 1),
          pv("d1408-p5", "PV C38", 1),
          pv("d1408-p6", "PV C39", 1),
          pv("d1408-p7", "PV C40", 1),
        ]),
      ]),
      front("d1408-2", "pavimentacao", [
        pav("d1408-2a", "base", JOA, 140),
        pav("d1408-2b", "sub_base", VIS, 82),
      ]),
      front("d1408-3", "pavimentacao", [pav("d1408-3a", "preparo_calcada", JOS, 110)]),
      front("d1408-4", "pavimentacao", [pav("d1408-4a", "cbuq", JOA, 230)]),
    ]),

    day("2026-08-17", [
      front("d1708-1", "pavimentacao", [
        pav("d1708-1a", "regularizacao", VIS, 120),
        pav("d1708-1b", "sub_base", VIS, 130),
        pav("d1708-1c", "meio_fio", VIS, 148),
      ]),
      front("d1708-2", "pavimentacao", [
        pav("d1708-2a", "preparo_calcada", JOS, 180, { semMetalon: true }),
      ]),
    ], "Produção afetada por conta de solo saturado devido chuva do fim de semana"),

    day("2026-08-18", [
      front("d1808-1", "drenagem", [
        dren("d1808-1a", "caixa_ralo", VIS, [
          pv("d1808-p1", "PV D2", 1, 1, 1),
          pv("d1808-p2", "PV D4", 2, 0, 2),
          pv("d1808-p3", "PV D13", 1),
        ]),
      ]),
      front("d1808-2", "pavimentacao", [
        pav("d1808-2a", "demolicao_calcada", VIS, 100),
        pav("d1808-2b", "regularizacao", VIS, 150),
        pav("d1808-2c", "sub_base", VIS, 140),
        pav("d1808-2d", "meio_fio", VIS, 75),
      ]),
      front("d1808-3", "pavimentacao", [
        pav("d1808-3a", "preparo_calcada", JOS, 175, { semMetalon: true }),
        pav("d1808-3b", "concretagem_calcada", JOS, 62),
      ]),
    ]),

    day("2026-08-19", [
      front("d1908-1", "drenagem", [
        dren("d1908-1a", "caixa_ralo", VIS, [
          pv("d1908-p1", "PV D3", 1, 0, 1),
          pv("d1908-p2", "PV D5", 3, 0, 2),
          pv("d1908-p3", "PV D6", 2, 0, 1),
          pv("d1908-p4", "PV D7", 2),
          pv("d1908-p5", "PV D8", 2),
          pv("d1908-p6", "PV D9", 1, 0, 1),
          pv("d1908-p7", "PV D10", 1),
        ]),
      ]),
      front("d1908-2", "pavimentacao", [
        pav("d1908-2a", "enchimento_caixa", VIS, 270),
        pav("d1908-2b", "base", VIS, 70),
        pav("d1908-2c", "meio_fio", VIS, 127),
      ]),
    ]),

    day("2026-08-20", [
      front("d2008-1", "drenagem", [
        dren("d2008-1a", "ramal", VIS, [
          pv("d2008-p1", "PV D17", 2, 4),
          pv("d2008-p2", "PV D18", 1, 3),
        ]),
      ]),
      front("d2008-2", "drenagem", [
        dren("d2008-2a", "caixa_ralo", VIS, [
          pv("d2008-p3", "PV D8", 1),
          pv("d2008-p4", "PV D9", 1, 2),
          pv("d2008-p5", "PV D10", 1),
          pv("d2008-p6", "PV D11", 1, 2, 1),
        ]),
      ]),
      front("d2008-3", "drenagem", [
        dren("d2008-3a", "alteamento", VIS, [
          pv("d2008-p7", "PV D1", 1, 0, 0, 2),
          pv("d2008-p8", "PV D2", 1, 0, 0, 2),
        ]),
      ]),
      front("d2008-4", "pavimentacao", [
        pav("d2008-4a", "enchimento_caixa", VIS, 80),
        pav("d2008-4b", "base", VIS, 180),
        pav("d2008-4c", "meio_fio", VIS, 78),
      ]),
      front("d2008-5", "pavimentacao", [pav("d2008-5a", "concretagem_calcada", JOS, 140)]),
    ]),

    day("2026-08-21", [
      front("d2108-1", "drenagem", [
        dren("d2108-1a", "ramal", VIS, [
          pv("d2108-p1", "PV D18", 2, 6),
          pv("d2108-p2", "PV D19", 2, 4),
        ]),
      ]),
      front("d2108-2", "drenagem", [
        dren("d2108-2a", "caixa_ralo", VIS, [
          pv("d2108-p3", "PV D11", 1, 0, 1),
          pv("d2108-p4", "PV D12", 1, 0, 1),
          pv("d2108-p5", "PV D13", 1, 0, 1),
        ]),
      ]),
      front("d2108-3", "drenagem", [
        dren("d2108-3a", "alteamento", VIS, [
          pv("d2108-p6", "PV D3", 1),
          pv("d2108-p7", "PV D4", 1),
          pv("d2108-p8", "PV D5", 1),
          pv("d2108-p9", "PV D6", 1),
          pv("d2108-p10", "PV D7", 1),
          pv("d2108-p11", "PV D8", 1, 0, 0, 16),
        ]),
      ]),
      front("d2108-4", "pavimentacao", [
        pav("d2108-4a", "regularizacao", VIS, 90),
        pav("d2108-4b", "enchimento_subbase", VIS, 90),
        pav("d2108-4c", "sub_base", VIS, 80),
        pav("d2108-4d", "base", VIS, 90),
        pav("d2108-4e", "meio_fio", VIS, 64),
      ]),
      front("d2108-5", "pavimentacao", [pav("d2108-5a", "concretagem_calcada", VIS, 66)]),
    ]),

    day("2026-08-24", [
      front("d2408-1", "drenagem", [
        dren("d2408-1a", "caixa_ralo", VIS, [pv("d2408-p1", "PV D13", 1, 0, 1)]),
      ]),
      front("d2408-2", "drenagem", [
        dren("d2408-2a", "alteamento", VIS, [pv("d2408-p2", "PV D15", 1, 0, 0, 2)]),
      ]),
      front("d2408-3", "pavimentacao", [
        pav("d2408-3a", "sub_base", VIS, 90),
        pav("d2408-3b", "base", VIS, 90),
        pav("d2408-3c", "regularizacao", PRE, 100),
      ]),
      front("d2408-4", "pavimentacao", [pav("d2408-4a", "preparo_calcada", JOS, 96)]),
      front("d2408-5", "pavimentacao", [pav("d2408-5a", "cbuq", VIS, 200)]),
    ]),

    day("2026-08-25", [
      front("d2508-1", "pavimentacao", [
        pav("d2508-1a", "meio_fio", VIS, 131),
        pav("d2508-1b", "regularizacao", PRE, 150),
        pav("d2508-1c", "regularizacao", ALB, 250),
      ]),
      front("d2508-2", "pavimentacao", [
        pav("d2508-2a", "preparo_calcada", JOS, 106, { semMetalon: true }),
      ]),
      front("d2508-3", "pavimentacao", [
        pav("d2508-3a", "cbuq", JOA, 60),
        pav("d2508-3b", "cbuq", VIS, 130),
      ]),
    ], "Produção afetada — patrol quebrou às 11h"),

    day("2026-08-26", [
      front("d2608-1", "drenagem", [
        dren("d2608-1a", "ramal", VIS, [
          pv("d2608-p1", "PV D20", 2, 4),
          pv("d2608-p2", "PV D21", 3, 8),
        ]),
        dren("d2608-1b", "ramal", PRE, [pv("d2608-p3", "PV A22.7", 1, 1)]),
      ]),
      front("d2608-2", "drenagem", [
        dren("d2608-2a", "caixa_ralo", VIS, [pv("d2608-p4", "PV D14", 1, 0, 1)]),
      ]),
      front("d2608-3", "pavimentacao", [
        pav("d2608-3a", "demolicao_calcada", PRE, 130, { existente: true }),
      ]),
      front("d2608-4", "pavimentacao", [
        pav("d2608-4a", "preparo_calcada", JOS, 170, { semMetalon: true }),
      ]),
    ]),

    day("2026-08-28", [
      front("d2808-1", "drenagem", [
        dren("d2808-1a", "ramal", VIS, [
          pv("d2808-p1", "PV D21", 1, 3),
          pv("d2808-p2", "PV D22", 2, 4),
          pv("d2808-p3", "PV D23", 1, 4),
        ]),
      ]),
      front("d2808-2", "drenagem", [
        dren("d2808-2a", "caixa_ralo", VIS, [
          pv("d2808-p4", "PV D14", 1, 0, 1),
          pv("d2808-p5", "PV D15", 1, 0, 1),
          pv("d2808-p6", "PV D16", 2, 0, 1),
        ]),
      ]),
      front("d2808-3", "pavimentacao", [
        pav("d2808-3a", "regularizacao", PRE, 50),
        pav("d2808-3b", "sub_base", PRE, 100),
        pav("d2808-3c", "meio_fio", VIS, 30),
      ]),
      front("d2808-4", "pavimentacao", [pav("d2808-4a", "concretagem_calcada", JOS, 153)]),
    ], "Produção afetada por conta de solo saturado devido chuva do dia anterior"),

    day(
      "2026-09-28",
      [],
      "",
      "Produção afetada por conta de solo saturado devido chuva. Falta de bica na obra de 28/09 a 30/09.",
    ),

    day("2026-09-29", [
      front("d2909-1", "drenagem", [
        dren("d2909-1a", "ramal", VIS, [pv("d2909-p1", "PV D30", 3, 11)]),
      ]),
      front("d2909-2", "pavimentacao", [
        pav("d2909-2a", "solo", VIS, 4, { soloUnit: "m3" }),
        pav("d2909-2b", "regularizacao", VIS, 180),
        pav("d2909-2c", "sub_base", VIS, 40),
      ]),
      front("d2909-3", "pavimentacao", [pav("d2909-3a", "concretagem_calcada", JOA, 122)]),
    ]),

    day("2026-09-30", [
      front("d3009-1", "drenagem", [
        dren("d3009-1a", "ramal", VIS, [
          pv("d3009-p1", "PV D31", 1, 2),
          pv("d3009-p2", "PV D32", 2, 5),
        ]),
      ]),
      front("d3009-2", "pavimentacao", [
        pav("d3009-2a", "regularizacao", ANG, 50),
        pav("d3009-2b", "regularizacao", VIS, 90),
      ]),
      front("d3009-3", "pavimentacao", [pav("d3009-3a", "regularizacao", PRE, 240)]),
    ], "", "Pá carregadeira da usina de concreto quebrou, por esse motivo não teve concreto."),

    day("2026-10-01", [
      front("d0110-1", "pavimentacao", [pav("d0110-1a", "regularizacao", VIS, 180)]),
      front("d0110-2", "pavimentacao", [
        pav("d0110-2a", "preparo_calcada", JOA, 84),
        pav("d0110-2b", "concretagem_calcada", JOA, 63),
      ]),
      front("d0110-3", "pavimentacao", [pav("d0110-3a", "piso_tatil", BAR, 36, { rampas: 2 })]),
    ], "", "Produção afetada por conta de solo saturado devido chuva."),

    day("2026-10-02", [
      front("d0210-1", "pavimentacao", [pav("d0210-1a", "concretagem_calcada", JOA, 60)]),
      front("d0210-2", "pavimentacao", [pav("d0210-2a", "piso_tatil", BAR, 36, { rampas: 2 })]),
    ], "Produção afetada por conta de chuva, 4mm de chuva durante o dia"),

    day("2026-10-06", [
      front("d0610-1", "pavimentacao", [
        pav("d0610-1a", "solo", VIS, 7.5, { soloUnit: "m", soloPv: "PV D24" }),
        pav("d0610-1b", "regularizacao", ANG, 100),
      ]),
      front("d0610-2", "pavimentacao", [pav("d0610-2a", "sub_base", VIS, 70)]),
      front("d0610-3", "pavimentacao", [
        pav("d0610-3a", "preparo_calcada", PRE, 50),
        pav("d0610-3b", "concretagem_calcada", JOA, 120),
      ]),
      front("d0610-4", "pavimentacao", [pav("d0610-4a", "piso_tatil", BAR, 54, { rampas: 3 })]),
    ]),
  ];

  const map: Record<string, DayReport> = {};
  for (const item of list) map[item.date] = item;
  return map;
}
