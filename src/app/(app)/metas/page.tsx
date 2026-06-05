import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Metas" };

export default function MetasPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Metas estratégicas" description="Configuración de metas individuales y grupales." />
      <ComingSoon modulo="Metas" detalle="Metas individuales/grupales por periodos con seguimiento de cumplimiento." />
    </div>
  );
}
