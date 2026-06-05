import type { Metadata } from "next";
import { Target, TrendingUp, Gauge } from "lucide-react";
import {
  getMetasConCumplimiento,
  getMetasResumen,
  getVendedores,
} from "@/modules/metas/queries";
import { formatNumero, formatPorcentaje } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MetaFormDialog } from "@/components/metas/meta-form-dialog";
import { MetasTable } from "@/components/metas/metas-table";

export const metadata: Metadata = { title: "Metas" };
export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const [metas, vendedores] = await Promise.all([getMetasConCumplimiento(), getVendedores()]);
  const resumen = await getMetasResumen(metas);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metas estratégicas"
        description="Configuración y seguimiento de metas individuales y grupales."
      >
        <MetaFormDialog vendedores={vendedores} />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Metas activas" value={formatNumero(resumen.total)} icon={Target} accent="var(--brand-blue)" />
        <StatCard title="Cumplimiento promedio" value={formatPorcentaje(resumen.promedio)} icon={Gauge} accent="var(--brand-cyan)" />
        <StatCard title="En alto desempeño" value={formatNumero(resumen.alto)} icon={TrendingUp} accent="var(--brand-green)" />
      </div>

      <MetasTable metas={metas} vendedores={vendedores} />
    </div>
  );
}
