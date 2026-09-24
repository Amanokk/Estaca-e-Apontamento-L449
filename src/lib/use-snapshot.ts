import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  endApontamento,
  fetchPresence,
  fetchSnapshot,
  removeApontamento,
  saveApontamento,
  sendPresence,
} from "./field-actions";
import type { SavePayload } from "./api";
import { getCrewLabel, getDeviceId, haversineMeters } from "./field-geo";
import { seedSnapshot } from "./local-store";
import type { GpsState, LastUsed, Presence, Snapshot } from "./types";

export const SNAPSHOT_KEY = ["snapshot"] as const;
export const PRESENCE_KEY = ["presence"] as const;

export function useSnapshot(_initial?: Snapshot, live = false) {
  return useQuery({
    queryKey: SNAPSHOT_KEY,
    queryFn: () => fetchSnapshot(),
    staleTime: live ? 8_000 : 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: live ? 12_000 : false,
    placeholderData: (prev) => prev ?? seedSnapshot(),
  });
}

export function useLivePresence(enabled: boolean, _initial?: Presence[]) {
  return useQuery({
    queryKey: PRESENCE_KEY,
    queryFn: () => fetchPresence(),
    enabled,
    staleTime: 6_000,
    refetchInterval: enabled ? 8_000 : false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev ?? [],
  });
}

export function useSnapshotData(): Snapshot | undefined {
  return useSnapshot().data;
}

export function useInvalidateSnapshot() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: SNAPSHOT_KEY });
    void qc.invalidateQueries({ queryKey: PRESENCE_KEY });
  };
}

export function useUpsertApontamento() {
  const invalidate = useInvalidateSnapshot();
  return useMutation({
    mutationFn: (data: SavePayload) => saveApontamento(data),
    onSuccess: () => void invalidate(),
  });
}

export function useCloseApontamento() {
  const invalidate = useInvalidateSnapshot();
  return useMutation({
    mutationFn: (data: { id: string; end: string }) => endApontamento(data.id, data.end),
    onSuccess: () => void invalidate(),
  });
}

export function useDeleteApontamento() {
  const invalidate = useInvalidateSnapshot();
  return useMutation({
    mutationFn: (id: string) => removeApontamento(id),
    onSuccess: () => void invalidate(),
  });
}

export function usePresencePing(
  gps: GpsState,
  last: LastUsed & { activityId?: string; apontamentoId?: string | null },
) {
  const lat = gps.status === "ready" ? gps.lat : null;
  const lng = gps.status === "ready" ? gps.lng : null;
  const acc = gps.status === "ready" ? gps.accuracy : null;
  const lastSent = useRef({ lat: 0, lng: 0, t: 0 });

  useEffect(() => {
    if (lat == null || lng == null) return;

    const send = (force: boolean) => {
      const moved = haversineMeters({ lat, lng }, lastSent.current);
      const age = Date.now() - lastSent.current.t;
      if (!force && moved < 8 && age < 12_000) return;
      lastSent.current = { lat, lng, t: Date.now() };
      void sendPresence({
        deviceId: getDeviceId(),
        label: getCrewLabel() || "No campo",
        lat,
        lng,
        accuracy: acc,
        workId: last.workId || null,
        equipmentId: last.equipmentId || null,
        streetId: last.streetId || null,
        activityId: last.activityId || null,
        apontamentoId: last.apontamentoId || null,
      });
    };

    send(false);
    const id = window.setInterval(() => send(true), 12_000);
    return () => window.clearInterval(id);
  }, [
    lat,
    lng,
    acc,
    last.workId,
    last.equipmentId,
    last.streetId,
    last.activityId,
    last.apontamentoId,
  ]);
}
