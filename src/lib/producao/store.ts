import { create } from "zustand";
import { DEFAULT_STREETS } from "./catalog";
import { streetName } from "./dates";
import { todayISO } from "./dates";
import { seedDays } from "./seed";
import { emptyDay, type DayReport, type Discipline, type Front, type Line } from "./types";

const KEY = "producao-do-dia-v1";

type Persisted = {
  days: Record<string, DayReport>;
  streets: string[];
  selected: string;
  banner: boolean;
};

type DiarioState = Persisted & {
  ready: boolean;
  select: (iso: string) => void;
  dismissBanner: () => void;
  addFront: (date: string, discipline: Discipline) => string;
  removeFront: (date: string, frontId: string) => void;
  moveFront: (date: string, frontId: string, dir: -1 | 1) => void;
  addLines: (date: string, frontId: string, lines: Line[]) => void;
  replaceLine: (date: string, frontId: string, line: Line) => void;
  removeLine: (date: string, frontId: string, lineId: string) => void;
  moveLine: (date: string, frontId: string, lineId: string, dir: -1 | 1) => void;
  setObs: (date: string, obs: string) => void;
  setRecado: (date: string, recado: string) => void;
  setCustom: (date: string, customText: string | null) => void;
  removeDay: (date: string) => void;
  rememberStreet: (street: string) => void;
};

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function patchDay(
  days: Record<string, DayReport>,
  date: string,
  fn: (day: DayReport) => DayReport,
): Record<string, DayReport> {
  const current = days[date] ?? emptyDay(date);
  return { ...days, [date]: fn(current) };
}

let hydrated = false;

export const useDiario = create<DiarioState>((set, get) => ({
  ready: false,
  days: {},
  streets: DEFAULT_STREETS,
  selected: todayISO(),
  banner: false,
  select: (iso) => set({ selected: iso }),
  dismissBanner: () => set({ banner: false }),
  addFront: (date, discipline) => {
    const id = uid("fr");
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: [...day.fronts, { id, discipline, lines: [] }],
      })),
    });
    return id;
  },
  removeFront: (date, frontId) => {
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: day.fronts.filter((f) => f.id !== frontId),
      })),
    });
  },
  moveFront: (date, frontId, dir) => {
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: moveWithin(day.fronts, frontId, dir),
      })),
    });
  },
  addLines: (date, frontId, lines) => {
    if (!lines.length) return;
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: day.fronts.map((f) => (f.id === frontId ? { ...f, lines: [...f.lines, ...lines] } : f)),
      })),
    });
  },
  replaceLine: (date, frontId, line) => {
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: day.fronts.map((f) =>
          f.id === frontId ? { ...f, lines: f.lines.map((l) => (l.id === line.id ? line : l)) } : f,
        ),
      })),
    });
  },
  removeLine: (date, frontId, lineId) => {
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: day.fronts.map((f) =>
          f.id === frontId ? { ...f, lines: f.lines.filter((l) => l.id !== lineId) } : f,
        ),
      })),
    });
  },
  moveLine: (date, frontId, lineId, dir) => {
    set({
      days: patchDay(get().days, date, (day) => ({
        ...day,
        fronts: day.fronts.map((f) => {
          if (f.id !== frontId) return f;
          const i = f.lines.findIndex((l) => l.id === lineId);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= f.lines.length) return f;
          const lines = f.lines.slice();
          const [item] = lines.splice(i, 1);
          if (!item) return f;
          lines.splice(j, 0, item);
          return { ...f, lines };
        }),
      })),
    });
  },
  setObs: (date, obs) => set({ days: patchDay(get().days, date, (day) => ({ ...day, obs })) }),
  setRecado: (date, recado) => set({ days: patchDay(get().days, date, (day) => ({ ...day, recado })) }),
  setCustom: (date, customText) =>
    set({ days: patchDay(get().days, date, (day) => ({ ...day, customText })) }),
  removeDay: (date) => {
    const days = { ...get().days };
    delete days[date];
    set({ days });
  },
  rememberStreet: (street) => {
    const name = streetName(street);
    if (!name) return;
    const exists = get().streets.some((s) => s.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"));
    if (exists) return;
    set({ streets: [...get().streets, name] });
  },
}));

function moveWithin(fronts: Front[], id: string, dir: -1 | 1): Front[] {
  const front = fronts.find((f) => f.id === id);
  if (!front) return fronts;
  const same = fronts.filter((f) => f.discipline === front.discipline);
  const idx = same.findIndex((f) => f.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= same.length) return fronts;
  const a = same[idx];
  const b = same[swap];
  if (!a || !b) return fronts;
  const next = fronts.slice();
  const ia = next.findIndex((f) => f.id === a.id);
  const ib = next.findIndex((f) => f.id === b.id);
  next[ia] = b;
  next[ib] = a;
  return next;
}

export function hydrateDiario() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  let next: Persisted = {
    days: seedDays(),
    streets: DEFAULT_STREETS,
    selected: todayISO(),
    banner: true,
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw) as Partial<Persisted>;
      next = {
        days: data.days && typeof data.days === "object" ? data.days : seedDays(),
        streets: Array.isArray(data.streets) && data.streets.length ? data.streets : DEFAULT_STREETS,
        selected: typeof data.selected === "string" ? data.selected : todayISO(),
        banner: Boolean(data.banner),
      };
    }
  } catch {
    /* keep seed */
  }
  useDiario.setState({ ...next, ready: true });
}

if (typeof window !== "undefined") {
  useDiario.subscribe((state) => {
    if (!state.ready) return;
    const payload: Persisted = {
      days: state.days,
      streets: state.streets,
      selected: state.selected,
      banner: state.banner,
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  });
}

export function newId(prefix: string): string {
  return uid(prefix);
}
