const SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"] as const;
const LONG = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"] as const;

export function todayISO(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function shiftISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

export function formatBR(iso: string, withYear = false): string {
  const [y, m, d] = iso.split("-");
  if (!d || !m) return iso;
  return withYear ? `${d}/${m}/${y}` : `${d}/${m}`;
}

export function weekday(iso: string, long = false): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return (long ? LONG : SHORT)[dt.getDay()] ?? "";
}

export function streetName(street: string): string {
  return street.trim().replace(/\s+/g, " ").replace(/^rua\s+/i, "");
}

export function streetKey(street: string): string {
  return streetName(street).toLocaleLowerCase("pt-BR");
}
