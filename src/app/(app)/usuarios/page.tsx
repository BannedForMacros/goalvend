import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserCog, UserCheck, Briefcase } from "lucide-react";
import { auth } from "@/auth";
import { getUsuarios, getUsuariosResumen } from "@/modules/usuarios/queries";
import { formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsuarioFormDialog } from "@/components/usuarios/usuario-form-dialog";
import { UsuariosTable } from "@/components/usuarios/usuarios-table";

export const metadata: Metadata = { title: "Usuarios" };
export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "GERENTE"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const [usuarios, resumen] = await Promise.all([getUsuarios(), getUsuariosResumen()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" description="Gestión de usuarios y roles del sistema.">
        <UsuarioFormDialog />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total usuarios" value={formatNumero(resumen.total)} icon={UserCog} accent="var(--brand-blue)" />
        <StatCard title="Activos" value={formatNumero(resumen.activos)} icon={UserCheck} accent="var(--brand-green)" />
        <StatCard title="Vendedores" value={formatNumero(resumen.vendedores)} icon={Briefcase} accent="var(--brand-purple)" />
      </div>

      <UsuariosTable usuarios={usuarios} />
    </div>
  );
}
