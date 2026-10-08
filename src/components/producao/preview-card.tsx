import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatBR } from "@/lib/producao/dates";
import { hasBody, textToCopy } from "@/lib/producao/format";
import type { DayReport } from "@/lib/producao/types";
import { Button, copyText, whatsAppHref } from "./ui";

export function PreviewCard({ day, compact = false }: { day: DayReport; compact?: boolean }) {
  const text = textToCopy(day);
  const ready = hasBody(day);
  const [copied, setCopied] = useState<"text" | "recado" | null>(null);

  const copy = async (value: string, which: "text" | "recado") => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(which);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section className="rounded-3xl border border-line bg-paper p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Texto do dia</p>
      <p className="mt-1 text-sm text-muted">{formatBR(day.date, true)}</p>
      <pre
        data-testid="preview-text"
        className={`mt-3 overflow-auto whitespace-pre-wrap font-sans text-base leading-relaxed text-ink ${compact ? "max-h-40" : "max-h-96"}`}
      >
        {ready ? text : day.recado.trim() ? "Sem frente de produção neste dia." : "Adicione um serviço para montar o texto."}
      </pre>
      <div className="mt-4 flex flex-col gap-2">
        <Button className="w-full" disabled={!ready} onClick={() => copy(text, "text")}>
          {copied === "text" ? <Check className="size-5" /> : <Copy className="size-5" />}
          {copied === "text" ? "Copiado" : "Copiar texto"}
        </Button>
        {ready ? (
          <a
            href={whatsAppHref(text)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-dren text-base font-semibold text-dren-fg"
          >
            Abrir no WhatsApp
          </a>
        ) : null}
        {day.recado.trim() ? (
          <Button variant="line" className="w-full" onClick={() => copy(day.recado.trim(), "recado")}>
            {copied === "recado" ? "Recado copiado" : "Copiar recado"}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
