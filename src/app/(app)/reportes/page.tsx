import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Reportes" };

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reportes inteligentes" description="Exportación de reportes en PDF y Excel." />
      <ComingSoon modulo="Reportes" detalle="Reportes de ventas, KPIs y cartera con exportación a PDF y Excel." />
    </div>
  );
}
