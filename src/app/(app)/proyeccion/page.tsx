import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Proyección" };

export default function ProyeccionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Proyección comercial" description="Tendencias, estimación de metas y riesgos." />
      <ComingSoon modulo="Proyección" detalle="Estimación de cumplimiento, tendencias de ventas y riesgos de incumplimiento." />
    </div>
  );
}
