import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const alertas = await prisma.alerta.count({ where: { leida: false } });

  return (
    <SidebarProvider>
      <AppSidebar rol={session.user.role} />
      <SidebarInset>
        <AppHeader
          nombre={session.user.name ?? "Usuario"}
          email={session.user.email ?? ""}
          rol={session.user.role}
          alertas={alertas}
        />
        <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
