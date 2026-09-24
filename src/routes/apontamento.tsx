import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Plus, Square } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { openForEquipment } from "@/lib/crew";
import { loadLast } from "@/lib/field-geo";
import { useCloseApontamento, useSnapshot } from "@/lib/use-snapshot";
import { formatDateBR, formatDuration, minutesBetween, nowHHMM, todayISO } from "@/lib/utils";

export const Route = createFileRoute("/apontamento")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { data } = useSnapshot(undefined, true);
  const closeMut = useCloseApontamento();
  const [tick, setTick] = useState(nowHHMM());
  const last = loadLast();

  useEffect(() => {
    const id = setInterval(() => setTick(nowHHMM()), 30000);
    return () => clearInterval(id);
  }, []);

  const today = todayISO();
  const rows = useMemo(
    () =>
      (data?.apontamentos ?? [])
        .filter((a) => a.date === today)
        .sort((a, b) => a.start.localeCompare(b.start) || a.createdAt.localeCompare(b.createdAt)),
    [data?.apontamentos, today],
  );
  const open = (data?.apontamentos ?? []).filter((a) => !a.end);
  const myOpen = openForEquipment(open, last.equipmentId) ?? open[0];
  const hours = rows.reduce((acc, a) => acc + minutesBetween(a.start, a.end ?? tick), 0);

  return (
    <AppShell>
      <header className="px-4 pb-2 pt-[max(16px,env(safe-area-inset-top))]">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">Apontamento</p>
            <h1 className="font-display text-2xl font-semibold leading-none text-fg">{formatDateBR(today)}</h1>
          </div>
          <p className="text-sm tabular-nums text-muted">
            {rows.length} · {formatDuration(hours)}
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-6">
        <Link
          to="/novo"
          className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-base font-semibold text-accent-fg"
        >
          <Plus className="size-5" />
          {myOpen ? "Atualizar atividade" : "Nova atividade"}
        </Link>

        {open.length > 0 ? (
          <section className="rounded-xl border border-ok/25 bg-surface p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ok">Em andamento</p>
            <div className="flex flex-col gap-2">
              {open.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg bg-ok-fg/40 px-3 py-2">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => void navigate({ to: "/novo", search: { edit: a.id } })}
                  >
                    <p className="truncate text-sm font-semibold text-fg">{a.equipmentName}</p>
                    <p className="truncate text-xs text-ok">
                      {a.activityName} · desde {a.start}
                      {a.streetName ? ` · ${a.streetName.replace(/^Rua /, "")}` : ""}
                    </p>
                  </button>
                  <Button
                    size="sm"
                    onClick={() => {
                      closeMut.mutate({ id: a.id, end: nowHHMM() });
                      toast.success("Atividade encerrada");
                    }}
                  >
                    <Square className="size-3.5 fill-current" />
                    Encerrar
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold">Do dia</h2>
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center">
              <Clock className="mx-auto mb-2 size-6 text-muted" />
              <p className="text-sm text-muted">Nenhuma atividade ainda. Toque em Nova atividade para começar.</p>
            </div>
          ) : (
            <ol className="flex flex-col gap-2">
              {rows.map((a) => (
                <li key={a.id}>
                  <Link
                    to="/novo"
                    search={{ edit: a.id }}
                    className="block rounded-xl border border-border bg-surface p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-sm tabular-nums text-muted">
                        {a.start}
                        {a.end ? `–${a.end}` : "–…"}
                      </p>
                      {!a.end ? (
                        <span className="rounded-full bg-ok-fg px-2 py-0.5 text-xs font-medium text-ok">andamento</span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-semibold">{a.equipmentName}</p>
                    <p className="text-sm text-muted">
                      {a.activityName}
                      {a.streetName ? ` · ${a.streetName.replace(/^Rua /, "")}` : ""}
                      {a.estaca ? ` · E ${a.estaca}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <p className="text-center text-xs text-muted">
          <Link to="/cadastros" className="text-accent">
            Cadastros
          </Link>
          {" · "}
          <Link to="/relatorio" className="text-accent">
            Relatório
          </Link>
        </p>
      </main>
    </AppShell>
  );
}
