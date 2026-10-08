import { ACTIVITY_META } from "./catalog";
import { fmtNum } from "./catalog";
import { formatBR, streetName } from "./dates";
import type { ActivityKind, DayReport, Front, Line, PvEntry } from "./types";

export function joinPt(parts: string[]): string {
  const clean = parts.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0]!;
  if (clean.length === 2) return `${clean[0]} e ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} e ${clean[clean.length - 1]}`;
}

function decap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toLocaleLowerCase("pt-BR") + s.slice(1);
}

function countNoun(n: number, one: string, many: string): string {
  return `${fmtNum(n)} ${n === 1 ? one : many}`;
}

function materialClause(p: PvEntry, kind: ActivityKind): string {
  const tubos = p.tubos > 0 ? `${countNoun(p.tubos, "tubo", "tubos")} de 400` : "";
  const pro = p.prolongadores > 0 ? countNoun(p.prolongadores, "Prolongador", "Prolongadores") : "";
  const aneis = p.aneis > 0 ? `${countNoun(p.aneis, "anel", "anéis")} de concreto` : "";
  const bits: string[] = [];
  if (kind === "caixa_ralo") {
    if (pro) bits.push(pro);
    if (tubos) bits.push(tubos);
    if (aneis) bits.push(aneis);
  } else if (kind === "alteamento") {
    if (aneis) bits.push(aneis);
  } else {
    if (tubos) bits.push(tubos);
    if (pro) bits.push(pro);
    if (aneis) bits.push(aneis);
  }
  return bits.length ? `(${joinPt(bits)})` : "";
}

function naRua(street: string): string {
  const name = streetName(street);
  return name ? ` na rua ${name}` : "";
}

function pavingPhrase(line: Line): string {
  const m = fmtNum(line.qty);
  switch (line.kind) {
    case "regularizacao":
      return `Regularização de ${m}m de sub leito`;
    case "sub_base":
      return `Execução de ${m}m de sub base`;
    case "base":
      return `Execução de ${m}m de base`;
    case "meio_fio":
      return `Concretagem de ${m}m de meio fio`;
    case "preparo_calcada":
      return `Preparo de ${m}m de calçada${line.semMetalon ? " sem metalon" : ""}`;
    case "concretagem_calcada":
      return `Concretagem de ${m}m de calçada`;
    case "demolicao_calcada":
      return `Demolição de ${m}m de calçada${line.existente ? " existente" : ""}`;
    case "enchimento_caixa":
      return `Enchimento de ${m}m de caixa de rua`;
    case "enchimento_subbase":
      return `Enchimento de ${m}m de sub base`;
    case "cbuq":
      return line.approx === false
        ? `Aplicação de ${m}T de CBUQ`
        : `Aplicação de aproximadamente ${m}T de CBUQ`;
    case "solo": {
      const unit = line.soloUnit === "m" ? "m" : "m³";
      const where = line.soloPv?.trim() ? ` no ${line.soloPv.trim()}` : "";
      return `Troca de ${m}${unit} de solo borrachudo${where}`;
    }
    case "piso_tatil": {
      const pecas = line.qty;
      const r = line.rampas ?? 0;
      const p = countNoun(pecas, "piso tátil", "pisos táteis");
      const ramp = r > 0 ? ` em ${countNoun(r, "rampa", "rampas")}` : "";
      return `Colocação e fixação de ${p}${ramp}`;
    }
    default:
      return "";
  }
}

type Family = "ramal" | "caixa" | "alteamento" | "pav";

function familyOf(kind: ActivityKind): Family {
  if (kind === "ramal") return "ramal";
  if (kind === "caixa_ralo") return "caixa";
  if (kind === "alteamento") return "alteamento";
  return "pav";
}

export function lineActive(line: Line): boolean {
  if (line.kind === "ramal" || line.kind === "caixa_ralo") {
    return line.pvs.some((p) => p.code.trim() && p.qty > 0);
  }
  if (line.kind === "alteamento") return line.pvs.some((p) => p.code.trim());
  return line.qty > 0;
}

function pvExec(kind: "ramal" | "caixa_ralo", pvs: PvEntry[], street: string): string {
  const bits = pvs
    .filter((p) => p.code.trim() && p.qty > 0)
    .map((p) => {
      const noun =
        kind === "ramal"
          ? countNoun(p.qty, "ramal", "ramais")
          : countNoun(p.qty, "caixa ralo", "caixas ralo");
      return `${noun} no ${p.code.trim()}${materialClause(p, kind)}`;
    });
  if (!bits.length) return "";
  return `Execução de ${joinPt(bits)}${naRua(street)}`;
}

function renderAlteamento(pvs: PvEntry[], street: string): string {
  const list = pvs.filter((p) => p.code.trim());
  if (!list.length) return "";
  const any = list.some((p) => p.aneis > 0);
  const head = list.length >= 3 && !any ? "Alteamento da tampa dos" : "Alteamento da tampa do";
  const bits = list.map((p) => `${p.code.trim()}${materialClause(p, "alteamento")}`);
  return `${head} ${joinPt(bits)}${naRua(street)}`;
}

function renderPaving(lines: Line[], street: string): string {
  const phrases = lines.filter((l) => l.qty > 0).map(pavingPhrase).filter(Boolean);
  if (!phrases.length) return "";
  const joined = joinPt(phrases.map((p, i) => (i === 0 ? p : decap(p))));
  return `${joined}${naRua(street)}`;
}

export function renderFront(front: Front): string {
  const clusters: { family: Family; street: string; lines: Line[] }[] = [];
  for (const line of front.lines) {
    if (!lineActive(line)) continue;
    const family = familyOf(line.kind);
    const keyStreet = streetName(line.street).toLocaleLowerCase("pt-BR");
    const last = clusters[clusters.length - 1];
    if (
      last &&
      last.family === family &&
      streetName(last.street).toLocaleLowerCase("pt-BR") === keyStreet
    ) {
      last.lines.push(line);
    } else {
      clusters.push({ family, street: line.street, lines: [line] });
    }
  }
  return clusters
    .map((c) => {
      if (c.family === "ramal") return pvExec("ramal", c.lines.flatMap((l) => l.pvs), c.street);
      if (c.family === "caixa") return pvExec("caixa_ralo", c.lines.flatMap((l) => l.pvs), c.street);
      if (c.family === "alteamento") return renderAlteamento(c.lines.flatMap((l) => l.pvs), c.street);
      return renderPaving(c.lines, c.street);
    })
    .filter(Boolean)
    .join(" / ");
}

export function renderDay(day: DayReport): string {
  const out: string[] = [`Produção do dia ${formatBR(day.date)}`, ""];
  const push = (label: string, discipline: Front["discipline"]) => {
    const fronts = day.fronts.filter((f) => f.discipline === discipline && renderFront(f));
    fronts.forEach((f, i) => {
      out.push(`${label} ${i + 1}: ${renderFront(f)}`);
      out.push("");
    });
  };
  push("Drenagem", "drenagem");
  push("Pavimentação", "pavimentacao");
  if (day.obs.trim()) out.push(`Obs: ${day.obs.trim()}`);
  return out.join("\n").replace(/\n+$/g, "");
}

export function textToCopy(day: DayReport): string {
  if (day.customText != null) return day.customText;
  return renderDay(day);
}

export function hasBody(day: DayReport): boolean {
  if (day.customText != null) return day.customText.trim().length > 0;
  if (day.obs.trim()) return true;
  return day.fronts.some((f) => renderFront(f).length > 0);
}

export function lineSummary(line: Line): { title: string; detail: string } {
  const title = ACTIVITY_META[line.kind].short;
  const street = streetName(line.street);
  if (line.kind === "ramal" || line.kind === "caixa_ralo" || line.kind === "alteamento") {
    const bits = line.pvs
      .filter((p) => p.code.trim())
      .map((p) => {
        const extras = [
          p.tubos > 0 ? `${fmtNum(p.tubos)} tubos` : "",
          p.prolongadores > 0 ? `${fmtNum(p.prolongadores)} prolong.` : "",
          p.aneis > 0 ? `${fmtNum(p.aneis)} anéis` : "",
        ].filter(Boolean);
        const head = line.kind === "alteamento" ? p.code.trim() : `${fmtNum(p.qty)}× ${p.code.trim()}`;
        return extras.length ? `${head} (${extras.join(", ")})` : head;
      });
    return { title, detail: [street, bits.join(", ")].filter(Boolean).join(" · ") };
  }
  const extras: string[] = [];
  if (line.semMetalon) extras.push("sem metalon");
  if (line.existente) extras.push("existente");
  if (line.kind === "solo" && line.soloPv) extras.push(line.soloPv);
  if (line.kind === "piso_tatil" && line.rampas) extras.push(`${fmtNum(line.rampas)} rampas`);
  let qty = "";
  if (line.kind === "cbuq") qty = `${fmtNum(line.qty)}t`;
  else if (line.kind === "solo") qty = `${fmtNum(line.qty)}${line.soloUnit === "m" ? "m" : "m³"}`;
  else if (line.kind === "piso_tatil") qty = `${fmtNum(line.qty)} pç`;
  else qty = `${fmtNum(line.qty)}m`;
  return { title, detail: [qty, street, extras.join(", ")].filter(Boolean).join(" · ") };
}

export function frontHeading(day: DayReport, front: Front): string {
  const label = front.discipline === "drenagem" ? "Drenagem" : "Pavimentação";
  const same = day.fronts.filter((f) => f.discipline === front.discipline && renderFront(f));
  const n = same.findIndex((f) => f.id === front.id);
  if (n < 0) return `${label} · vazia`;
  return `${label} ${n + 1}`;
}
