import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Ventas" };

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Ventas inteligentes" description="Registro y consolidación de operaciones comerciales." />
      <ComingSoon modulo="Ventas" detalle="Registro de ventas con consolidación automática e indicadores en tiempo real." />
    </div>
  );
}
