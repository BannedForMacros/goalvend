import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Indicadores KPI" };

export default function IndicadoresPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Indicadores KPI" description="Cumplimiento comercial con semáforo 🟢🟡🔴." />
      <ComingSoon modulo="Indicadores" detalle="Cálculo automático de cumplimiento = (Ventas / Meta) × 100 con semáforo." />
    </div>
  );
}
