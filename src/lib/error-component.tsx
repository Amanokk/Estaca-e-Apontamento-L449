import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "Algo deu errado. Recarregue a página e tente de novo.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const message = errorMessage(error);
  const isDb = /pglite|ENOENT|NO_DATABASE|\/var\/task/i.test(message);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Não foi possível abrir esta tela</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {isDb
          ? "O apontamento agora grava neste aparelho. Recarregue a página para continuar."
          : message}
      </p>
      <a
        href="/"
        className="mt-2 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-fg"
      >
        Voltar às estacas
      </a>
    </main>
  );
}
