import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Alertas" };

export default function AlertasPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Alertas comerciales" description="Notificaciones automáticas de productividad y cumplimiento." />
      <ComingSoon modulo="Alertas" detalle="Alertas generadas automáticamente por las reglas del sistema." />
    </div>
  );
}
