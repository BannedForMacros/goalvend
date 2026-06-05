import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Usuarios" };

export default async function UsuariosPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "GERENTE"].includes(session.user.role)) {
    redirect("/dashboard");
  }
  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" description="Gestión de usuarios y roles del sistema." />
      <ComingSoon modulo="Usuarios" detalle="Alta de usuarios, asignación de roles y control de acceso." />
    </div>
  );
}
