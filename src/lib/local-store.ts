import { ACTIVITIES, EQUIPMENT, STREETS, WORKS } from "./catalog";
import { buildDescription } from "./description";
import type {
  Activity,
  Apontamento,
  Equipment,
  Snapshot,
  Street,
  Work,
} from "./types";
import { uid } from "./utils";

const KEY = "l449.field-db.v1";

export type AptInput = {
  id: string;
  date: string;
  start: string;
  end: string | null;
  workId: string;
  streetId: string;
  equipmentId: string;
  activityId: string;
  estaca: string;
  pv: string;
  quantity: number | null;
  notes: string;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  locationLabel: string;
  deviceId: string;
};

type ExtraCatalog = {
  works: Work[];
  streets: Street[];
  equipment: Equipment[];
  activities: Activity[];
};

type Store = {
  apontamentos: Apontamento[];
  extra: ExtraCatalog;
  deletedIds: string[];
  inactiveStreetIds: string[];
  inactiveEquipmentIds: string[];
};

function emptyStore(): Store {
  return {
    apontamentos: [],
    extra: { works: [], streets: [], equipment: [], activities: [] },
    deletedIds: [],
    inactiveStreetIds: [],
    inactiveEquipmentIds: [],
  };
}

function mergeById<T extends { id: string }>(base: T[], extra: T[]): T[] {
  const map = new Map<string, T>();
  for (const row of base) map.set(row.id, row);
  for (const row of extra) map.set(row.id, row);
  return [...map.values()];
}

export function seedSnapshot(): Snapshot {
  return {
    works: WORKS,
    streets: STREETS,
    equipment: EQUIPMENT,
    activities: ACTIVITIES,
    apontamentos: [],
    presence: [],
  };
}

function readStore(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      apontamentos: Array.isArray(parsed.apontamentos) ? parsed.apontamentos : [],
      extra: {
        works: parsed.extra?.works ?? [],
        streets: parsed.extra?.streets ?? [],
        equipment: parsed.extra?.equipment ?? [],
        activities: parsed.extra?.activities ?? [],
      },
      deletedIds: parsed.deletedIds ?? [],
      inactiveStreetIds: parsed.inactiveStreetIds ?? [],
      inactiveEquipmentIds: parsed.inactiveEquipmentIds ?? [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(store));
}

function catalog(store: Store) {
  const works = mergeById(WORKS, store.extra.works);
  const streets = mergeById(STREETS, store.extra.streets).map((s) => ({
    ...s,
    active: store.inactiveStreetIds.includes(s.id) ? false : s.active,
  }));
  const equipment = mergeById(EQUIPMENT, store.extra.equipment).map((e) => ({
    ...e,
    active: store.inactiveEquipmentIds.includes(e.id) ? false : e.active,
  }));
  const activities = mergeById(ACTIVITIES, store.extra.activities);
  return { works, streets, equipment, activities };
}

export function localSnapshot(): Snapshot {
  const store = readStore();
  const deleted = new Set(store.deletedIds);
  const { works, streets, equipment, activities } = catalog(store);
  return {
    works,
    streets,
    equipment,
    activities,
    apontamentos: store.apontamentos.filter((a) => !deleted.has(a.id)),
    presence: [],
  };
}

function buildRow(data: AptInput, snap: Snapshot): Apontamento {
  const work = snap.works.find((w) => w.id === data.workId);
  const street = snap.streets.find((s) => s.id === data.streetId);
  const eq = snap.equipment.find((e) => e.id === data.equipmentId);
  const act = snap.activities.find((a) => a.id === data.activityId);
  const workName = work ? `${work.code} ${work.name}` : "";
  const streetName = street?.name ?? "";
  const equipmentName = eq?.name ?? "";
  const activityName = act?.name ?? "";
  const now = new Date().toISOString();
  return {
    id: data.id,
    date: data.date,
    start: data.start,
    end: data.end,
    workId: data.workId,
    workName,
    streetId: data.streetId,
    streetName,
    equipmentId: data.equipmentId,
    equipmentName,
    equipmentKind: eq?.kind ?? "truck",
    activityId: data.activityId,
    activityName,
    estaca: data.estaca,
    pv: data.pv,
    quantity: data.quantity,
    notes: data.notes,
    description: buildDescription({
      equipmentName,
      activityName,
      streetName,
      estaca: data.estaca,
      pv: data.pv,
    }),
    lat: data.lat,
    lng: data.lng,
    accuracy: data.accuracy,
    locationLabel: data.locationLabel,
    deviceId: data.deviceId,
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertApontamentoLocal(data: AptInput): Apontamento {
  const store = readStore();
  const snap = localSnapshot();
  const existing = store.apontamentos.find((a) => a.id === data.id);
  let id = data.id;
  let start = data.start;
  if (!existing) {
    const open = store.apontamentos.find((a) => a.equipmentId === data.equipmentId && !a.end);
    if (open) {
      id = open.id;
      start = open.start;
    }
  }
  const row = buildRow({ ...data, id, start }, snap);
  if (existing) row.createdAt = existing.createdAt;
  store.apontamentos = [row, ...store.apontamentos.filter((a) => a.id !== row.id)];
  store.deletedIds = store.deletedIds.filter((x) => x !== row.id);
  writeStore(store);
  return row;
}

export function closeApontamentoLocal(id: string, end: string) {
  const store = readStore();
  store.apontamentos = store.apontamentos.map((a) =>
    a.id === id ? { ...a, end, updatedAt: new Date().toISOString() } : a,
  );
  writeStore(store);
}

export function deleteApontamentoLocal(id: string) {
  const store = readStore();
  store.apontamentos = store.apontamentos.filter((a) => a.id !== id);
  if (!store.deletedIds.includes(id)) store.deletedIds.push(id);
  writeStore(store);
}

export function addWorkLocal(code: string, name: string): { id: string } {
  const store = readStore();
  const id = uid();
  store.extra.works.push({ id, code, name, active: true });
  writeStore(store);
  return { id };
}

export function addStreetLocal(name: string, workId: string): { id: string } {
  const store = readStore();
  const id = uid();
  store.extra.streets.push({ id, name, workId, active: true });
  writeStore(store);
  return { id };
}

export function addEquipmentLocal(input: {
  name: string;
  code: string;
  kind: Equipment["kind"];
  activityIds: string[];
}): { id: string } {
  const store = readStore();
  const id = uid();
  store.extra.equipment.push({
    id,
    code: input.code,
    name: input.name,
    kind: input.kind,
    activityIds: input.activityIds,
    active: true,
  });
  writeStore(store);
  return { id };
}

export function updateEquipmentLocal(input: {
  id: string;
  name?: string;
  code?: string;
  kind?: Equipment["kind"];
  activityIds?: string[];
  active?: boolean;
}): { ok: boolean } {
  const store = readStore();
  const { equipment } = catalog(store);
  const cur = equipment.find((e) => e.id === input.id);
  if (!cur) return { ok: false };
  const next: Equipment = {
    ...cur,
    name: input.name ?? cur.name,
    code: input.code ?? cur.code,
    kind: input.kind ?? cur.kind,
    activityIds: input.activityIds ?? cur.activityIds,
    active: input.active ?? cur.active,
  };
  store.extra.equipment = mergeById(store.extra.equipment, [next]);
  if (next.active) {
    store.inactiveEquipmentIds = store.inactiveEquipmentIds.filter((x) => x !== next.id);
  } else if (!store.inactiveEquipmentIds.includes(next.id)) {
    store.inactiveEquipmentIds.push(next.id);
  }
  writeStore(store);
  return { ok: true };
}

export function toggleStreetLocal(id: string): { ok: true } {
  const store = readStore();
  if (store.inactiveStreetIds.includes(id)) {
    store.inactiveStreetIds = store.inactiveStreetIds.filter((x) => x !== id);
  } else {
    store.inactiveStreetIds.push(id);
  }
  writeStore(store);
  return { ok: true };
}

export function addActivityLocal(name: string, equipmentId?: string): { id: string } {
  const store = readStore();
  const id = uid();
  store.extra.activities.push({ id, name, kind: "servico" });
  if (equipmentId) {
    const { equipment } = catalog(store);
    const cur = equipment.find((e) => e.id === equipmentId);
    if (cur) {
      const next = { ...cur, activityIds: [...cur.activityIds, id] };
      store.extra.equipment = mergeById(store.extra.equipment, [next]);
    }
  }
  writeStore(store);
  return { id };
}

export function mergeSnapshots(local: Snapshot, remote: Snapshot): Snapshot {
  const store = readStore();
  const deleted = new Set(store.deletedIds);
  const remoteApts = remote.apontamentos.filter((a) => !deleted.has(a.id));
  const remoteIds = new Set(remoteApts.map((a) => a.id));
  const localOnly = local.apontamentos.filter((a) => !remoteIds.has(a.id) && !deleted.has(a.id));
  return {
    works: mergeById(remote.works, local.works),
    streets: mergeById(remote.streets, local.streets),
    equipment: mergeById(remote.equipment, local.equipment),
    activities: mergeById(remote.activities, local.activities),
    apontamentos: [...remoteApts, ...localOnly],
    presence: remote.presence,
  };
}

export function persistMergedApontamentos(rows: Apontamento[]) {
  const store = readStore();
  store.apontamentos = rows;
  writeStore(store);
}
