import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Camera, ClipboardList, LocateFixed } from "lucide-react";
import { Splash } from "@/components/Splash";
import { CameraCapture } from "@/components/CameraCapture";
import { StakeMap, type MapPin } from "@/components/StakeMap";
import { AppShell } from "@/components/app-shell";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { findNearestStake, PROJECT_CENTER, quantize } from "@/lib/findStake";
import { getCrewLabel, getDeviceId, gpsQuality, loadLast, setCrewLabel } from "@/lib/field-geo";
import { useLivePresence, usePresencePing, useSnapshot } from "@/lib/use-snapshot";
import type { GpsState } from "@/lib/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const geo = useGeolocation(true);
  const online = useOnlineStatus();
  const { data } = useSnapshot(undefined, true);
  const { data: livePresence } = useLivePresence(true);
  const [demo, setDemo] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [follow, setFollow] = useState(true);
  const [recenterNonce, setRecenterNonce] = useState(0);
  const [label, setLabel] = useState(() => (typeof window === "undefined" ? "" : getCrewLabel()));

  useEffect(() => {
    if (geo.position || geo.error) return;
    const t = setTimeout(() => setDemo(true), 8000);
    return () => clearTimeout(t);
  }, [geo.position, geo.error]);

  const usingDemo = demo && !geo.position;
  const position = geo.position ?? (demo ? PROJECT_CENTER : null);
  const accuracy = geo.position ? geo.accuracy : usingDemo ? 8 : null;
  const posKey = position ? quantize(position) : null;
  const match = useMemo(
    () => (position ? findNearestStake(position) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [posKey],
  );

  const cameraMatch = match ?? (position ? findNearestStake(position, 800) : null);
  const last = loadLast();
  const deviceId = typeof window === "undefined" ? "" : getDeviceId();
  const open = useMemo(
    () => (data?.apontamentos ?? []).filter((a) => !a.end),
    [data?.apontamentos],
  );
  const myOpen =
    open.find((a) => a.equipmentId === last.equipmentId) ??
    open.find((a) => a.deviceId === deviceId);

  const gpsState: GpsState = position
    ? {
        status: "ready",
        lat: position.lat,
        lng: position.lng,
        accuracy: accuracy ?? 25,
        quality: gpsQuality(accuracy ?? 25),
        heading: geo.heading,
        updatedAt: Date.now(),
      }
    : { status: "idle" };

  usePresencePing(gpsState, {
    ...last,
    apontamentoId: myOpen?.id ?? null,
    activityId: myOpen?.activityId || last.activityId,
    equipmentId: myOpen?.equipmentId || last.equipmentId,
    streetId: myOpen?.streetId || last.streetId,
    workId: myOpen?.workId || last.workId,
  });

  const presence = livePresence ?? data?.presence ?? [];
  const pins: MapPin[] = useMemo(() => {
    const out: MapPin[] = [];
    const seen = new Set<string>();
    for (const p of presence) {
      if (p.deviceId === deviceId) continue;
      const a = open.find(
        (x) => x.id === p.apontamentoId || x.equipmentId === p.equipmentId || x.deviceId === p.deviceId,
      );
      if (a) seen.add(a.id);
      out.push({
        id: p.deviceId,
        lat: p.lat,
        lng: p.lng,
        kind: a ? "machine" : "crew",
        label: a ? a.equipmentName : p.label || "Disponível",
        sub: a ? a.activityName : "conectado",
      });
    }
    for (const a of open) {
      if (a.lat == null || a.lng == null) continue;
      if (seen.has(a.id) || a.deviceId === deviceId) continue;
      out.push({
        id: a.id,
        lat: a.lat,
        lng: a.lng,
        kind: "machine",
        label: a.equipmentName,
        sub: a.activityName,
      });
    }
    return out;
  }, [presence, open, deviceId]);

  const machines = pins.filter((p) => p.kind === "machine").length;
  const crew = pins.filter((p) => p.kind === "crew").length;

  const recenter = () => {
    setFollow(true);
    setRecenterNonce((n) => n + 1);
  };

  const apontarSearch = cameraMatch
    ? { estaca: String(cameraMatch.estaca), street: cameraMatch.street.name }
    : undefined;

  const streetShort = match?.street.name.replace(/^Rua /, "") ?? "";

  return (
    <AppShell>
      <div className="relative flex min-h-0 flex-1 flex-col bg-bg text-fg">
        <Splash />
        <div className="absolute inset-0">
          {!cameraOpen ? (
            <StakeMap
              position={position}
              accuracy={accuracy}
              match={match}
              follow={follow}
              onUserDrag={() => setFollow(false)}
              recenterNonce={recenterNonce}
              pins={pins}
            />
          ) : (
            <div className="absolute inset-0 bg-bg" />
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="pointer-events-auto rounded-2xl border border-border bg-bg/88 p-3 shadow-card backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-widest text-muted">
              <span>L449 · São Joaquim</span>
              <span className="flex items-center gap-2 normal-case tracking-normal">
                {!online ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">Offline</span> : null}
                {usingDemo ? <span className="rounded-full bg-gps/15 px-2 py-0.5 text-gps">Demo</span> : null}
                <span className={`tabular-nums ${data?.live ? "text-ok" : "text-muted"}`}>
                  {data?.live ? "Save global" : "Só neste aparelho"}
                </span>
                <span className="tabular-nums text-muted">GPS ±{accuracy ? accuracy.toFixed(0) : "--"} m</span>
              </span>
            </div>

            {match ? (
              <div className="mt-2 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted">{streetShort}</p>
                  <p className="font-display text-3xl font-semibold leading-none tracking-tight">E-{match.estaca}</p>
                </div>
                <p className="pb-0.5 text-right text-sm tabular-nums text-muted">
                  {match.offset >= 0 ? "+" : ""}
                  {match.offset.toFixed(1)} m
                  <span className="block text-xs text-muted/70">{match.distance.toFixed(1)} m do eixo</span>
                </p>
              </div>
            ) : geo.error && !usingDemo ? (
              <div className="mt-2">
                <p className="font-display text-xl font-semibold text-danger">Sem GPS</p>
                <p className="text-sm text-muted">{geo.error}</p>
                <button
                  type="button"
                  onClick={() => setDemo(true)}
                  className="mt-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-fg"
                >
                  Simular no bairro
                </button>
              </div>
            ) : !position ? (
              <div className="mt-2">
                <p className="font-display text-xl font-semibold">Obtendo GPS…</p>
                <p className="text-sm text-muted">Permita o acesso à localização.</p>
                <button
                  type="button"
                  onClick={() => setDemo(true)}
                  className="mt-2 rounded-full bg-subtle px-4 py-2 text-sm font-semibold text-fg"
                >
                  Simular no bairro
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <p className="font-display text-xl font-semibold">Fora do projeto</p>
                <p className="text-sm text-muted">Nenhuma rua a menos de 60 m.</p>
                <button
                  type="button"
                  onClick={() => setDemo(true)}
                  className="mt-2 rounded-full bg-subtle px-4 py-2 text-sm font-semibold text-fg"
                >
                  Ir para o bairro
                </button>
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <input
                value={label}
                maxLength={24}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={() => setCrewLabel(label)}
                placeholder="Seu nome no mapa"
                className="min-h-9 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-fg outline-none"
              />
              <p className="shrink-0 text-[11px] text-muted">
                {machines === 1 ? "1 máquina" : `${machines} máquinas`} ·{" "}
                {crew === 1 ? "1 disponível" : `${crew} disponíveis`}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/novo"
                search={apontarSearch ?? {}}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-3 text-sm font-semibold text-accent-fg"
              >
                <ClipboardList className="size-4" />
                {cameraMatch ? `Apontar E-${cameraMatch.estaca}` : "Apontar"}
              </Link>
              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-fg"
              >
                <Camera className="size-4" />
                Foto
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-20 left-3 z-20 rounded-xl border border-border bg-bg/80 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur-md">
          <p className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-fg/70" /> Estacas
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-ok" /> Equipe disponível
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" /> Máquina em atividade
          </p>
          <p className="mt-1 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-gps" /> Você
          </p>
        </div>

        <button
          type="button"
          onClick={recenter}
          aria-label="Centralizar no GPS"
          className="absolute bottom-4 right-4 z-20 grid size-12 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/25"
        >
          <LocateFixed className="size-5" />
        </button>

        {cameraOpen && (
          <CameraCapture
            onClose={() => setCameraOpen(false)}
            stamp={{
              estaca: cameraMatch ? `E-${cameraMatch.estaca}` : null,
              street: cameraMatch?.street.name ?? null,
              lat: position?.lat ?? null,
              lng: position?.lng ?? null,
            }}
          />
        )}
      </div>
    </AppShell>
  );
}
