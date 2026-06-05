import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Rendimiento" };

export default function RendimientoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Análisis de rendimiento" description="Ranking, comparativa y evolución de productividad." />
      <ComingSoon modulo="Rendimiento" detalle="Ranking comercial, comparación entre vendedores y desempeño histórico." />
    </div>
  );
}
