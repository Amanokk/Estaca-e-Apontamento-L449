import {
  addActivity as remoteAddActivity,
  addEquipment as remoteAddEquipment,
  addStreet as remoteAddStreet,
  addWork as remoteAddWork,
  closeApontamento as remoteClose,
  deleteApontamento as remoteDelete,
  getPresence as remoteGetPresence,
  getSnapshot as remoteGetSnapshot,
  pingPresence as remotePing,
  toggleStreet as remoteToggleStreet,
  updateEquipment as remoteUpdateEquipment,
  upsertApontamento as remoteUpsert,
  type SavePayload,
} from "./api";
import {
  addActivityLocal,
  addEquipmentLocal,
  addStreetLocal,
  addWorkLocal,
  closeApontamentoLocal,
  deleteApontamentoLocal,
  localSnapshot,
  mergeSnapshots,
  persistMergedApontamentos,
  seedSnapshot,
  toggleStreetLocal,
  updateEquipmentLocal,
  upsertApontamentoLocal,
} from "./local-store";
import type { Apontamento, Presence, Snapshot } from "./types";

async function tryRemote<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function fetchSnapshot(): Promise<Snapshot> {
  const local = typeof window === "undefined" ? seedSnapshot() : localSnapshot();
  const remote = await tryRemote(() => remoteGetSnapshot());
  if (!remote) return local;
  const merged = mergeSnapshots(local, remote);
  persistMergedApontamentos(merged.apontamentos);
  return merged;
}

export async function saveApontamento(data: SavePayload): Promise<Apontamento> {
  const row = upsertApontamentoLocal(data);
  const remote = await tryRemote(() => remoteUpsert({ data }));
  return remote ?? row;
}

export async function endApontamento(id: string, end: string) {
  closeApontamentoLocal(id, end);
  await tryRemote(() => remoteClose({ data: { id, end } }));
  return { ok: true as const };
}

export async function removeApontamento(id: string) {
  deleteApontamentoLocal(id);
  await tryRemote(() => remoteDelete({ data: { id } }));
  return { ok: true as const };
}

export async function fetchPresence(): Promise<Presence[]> {
  return (await tryRemote(() => remoteGetPresence())) ?? [];
}

export type PresencePing = {
  deviceId: string;
  label: string;
  lat: number;
  lng: number;
  accuracy: number | null;
  workId: string | null;
  equipmentId: string | null;
  streetId: string | null;
  activityId: string | null;
  apontamentoId: string | null;
};

export async function sendPresence(data: PresencePing): Promise<void> {
  await tryRemote(() => remotePing({ data }));
}

export async function addActivity(args: { data: { name: string; equipmentId?: string } }) {
  const remote = await tryRemote(() => remoteAddActivity(args));
  if (remote) return remote;
  return addActivityLocal(args.data.name, args.data.equipmentId);
}

export async function addWork(args: { data: { code: string; name: string } }) {
  const remote = await tryRemote(() => remoteAddWork(args));
  if (remote) return remote;
  return addWorkLocal(args.data.code, args.data.name);
}

export async function addStreet(args: { data: { name: string; workId: string } }) {
  const remote = await tryRemote(() => remoteAddStreet(args));
  if (remote) return remote;
  return addStreetLocal(args.data.name, args.data.workId);
}

export async function addEquipment(args: {
  data: {
    name: string;
    code: string;
    kind: "retro" | "rolo" | "basculante" | "pipa" | "van" | "truck";
    activityIds: string[];
  };
}) {
  const remote = await tryRemote(() => remoteAddEquipment(args));
  if (remote) return remote;
  return addEquipmentLocal(args.data);
}

export async function updateEquipment(args: {
  data: {
    id: string;
    name?: string;
    code?: string;
    kind?: "retro" | "rolo" | "basculante" | "pipa" | "van" | "truck";
    activityIds?: string[];
    active?: boolean;
  };
}) {
  const remote = await tryRemote(() => remoteUpdateEquipment(args));
  if (remote) return remote;
  return updateEquipmentLocal(args.data);
}

export async function toggleStreet(args: { data: { id: string } }) {
  const remote = await tryRemote(() => remoteToggleStreet(args));
  if (remote) return remote;
  return toggleStreetLocal(args.data.id);
}
