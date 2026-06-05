import type { Metadata } from "next";
import { Users, UserCheck, Building2 } from "lucide-react";
import { getClientes, getClientesResumen } from "@/modules/clientes/queries";
import { formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ClienteFormDialog } from "@/components/clientes/cliente-form-dialog";
import { ClientesTable } from "@/components/clientes/clientes-table";

export const metadata: Metadata = { title: "Clientes" };
export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const [clientes, resumen] = await Promise.all([getClientes(), getClientesResumen()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="Gestión de la cartera comercial.">
        <ClienteFormDialog />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total clientes" value={formatNumero(resumen.total)} icon={Users} accent="var(--brand-blue)" />
        <StatCard title="Activos" value={formatNumero(resumen.activos)} icon={UserCheck} accent="var(--brand-green)" />
        <StatCard title="Corporativos" value={formatNumero(resumen.corporativos)} icon={Building2} accent="var(--brand-purple)" />
      </div>

      <ClientesTable clientes={clientes} />
    </div>
  );
}
