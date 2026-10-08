import { createFileRoute } from "@tanstack/react-router";
import { ProducaoApp } from "@/components/producao/app";

export const Route = createFileRoute("/producao")({
  component: ProducaoPage,
});

function ProducaoPage() {
  return <ProducaoApp />;
}
