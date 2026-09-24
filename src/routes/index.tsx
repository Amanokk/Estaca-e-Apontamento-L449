import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Camera, ClipboardList, LocateFixed } from "lucide-react";
import { Splash } from "@/components/Splash";
import { CameraCapture } from "@/components/CameraCapture";
import { StakeMap } from "@/components/StakeMap";
import { AppShell } from "@/components/app-shell";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { findNearestStake, PROJECT_CENTER, quantize } from "@/lib/findStake";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const geo = useGeolocation(true);
  const online = useOnlineStatus();
  const [demo, setDemo] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [follow, setFollow] = useState(true);
  const [recenterNonce, setRecenterNonce] = useState(0);

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
          <StakeMap
            position={position}
            accuracy={accuracy}
            match={match}
            follow={follow}
            onUserDrag={() => setFollow(false)}
            recenterNonce={recenterNonce}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 pt-[max(12px,env(safe-area-inset-top))]">
          <div className="pointer-events-auto rounded-2xl border border-border bg-bg/88 p-3 shadow-card backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-widest text-muted">
              <span>L449 · São Joaquim</span>
              <span className="flex items-center gap-2 normal-case tracking-normal">
                {!online ? <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">Offline</span> : null}
                {usingDemo ? <span className="rounded-full bg-gps/15 px-2 py-0.5 text-gps">Demo</span> : null}
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
