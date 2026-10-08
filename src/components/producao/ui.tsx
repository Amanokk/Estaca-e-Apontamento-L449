import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { fmtNum, parseQty } from "@/lib/producao/catalog";

type Variant = "primary" | "dren" | "soft" | "line" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:opacity-90",
  dren: "bg-dren text-dren-fg hover:opacity-90",
  soft: "bg-soft text-ink hover:bg-line",
  line: "border border-line bg-paper text-ink hover:bg-soft",
  ghost: "bg-transparent text-ink hover:bg-soft",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold transition-opacity disabled:opacity-40 ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}

export function IconButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-ink hover:bg-soft disabled:opacity-30 ${className}`}
      {...props}
    />
  );
}

export function Stepper({
  value,
  onChange,
  blankZero = false,
  quick = false,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  blankZero?: boolean;
  quick?: boolean;
  label: string;
}) {
  const [text, setText] = useState(() => (blankZero && value === 0 ? "" : fmtNum(value)));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(blankZero && value === 0 ? "" : fmtNum(value));
  }, [value, focused, blankZero]);

  const commit = (raw: string) => {
    setText(raw);
    onChange(parseQty(raw));
  };

  const bump = (delta: number) => {
    const next = Math.max(0, Math.round((value + delta) * 100) / 100);
    onChange(next);
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl bg-soft text-lg text-ink"
          onClick={() => bump(-1)}
          aria-label={`Diminuir ${label}`}
        >
          −
        </button>
        <input
          inputMode="decimal"
          aria-label={label}
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setText(blankZero && value === 0 ? "" : fmtNum(value));
          }}
          onChange={(e) => {
            const raw = e.target.value;
            if (!/^[\d.,]*$/.test(raw)) return;
            commit(raw);
          }}
          className="h-11 w-16 rounded-xl border border-line bg-paper text-center text-base font-semibold text-ink outline-none focus:border-primary"
        />
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl bg-soft text-lg text-ink"
          onClick={() => bump(1)}
          aria-label={`Aumentar ${label}`}
        >
          +
        </button>
      </div>
      {quick ? (
        <div className="flex gap-1">
          {[10, 50].map((n) => (
            <button
              key={n}
              type="button"
              className="h-8 rounded-lg bg-soft px-2 text-sm font-semibold text-muted"
              onClick={() => bump(n)}
            >
              +{n}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function whatsAppHref(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-widest text-muted">{children}</p>;
}
