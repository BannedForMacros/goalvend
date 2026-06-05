import type { Metadata } from "next";
import { Bell, BellRing, OctagonAlert } from "lucide-react";
import { getAlertas, getAlertasResumen } from "@/modules/alertas/queries";
import { formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AlertasList } from "@/components/alertas/alertas-list";

export const metadata: Metadata = { title: "Alertas" };
export const dynamic = "force-dynamic";

export default async function AlertasPage() {
  const [alertas, resumen] = await Promise.all([getAlertas(), getAlertasResumen()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alertas comerciales"
        description="Notificaciones automáticas generadas por las reglas del sistema."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total alertas" value={formatNumero(resumen.total)} icon={Bell} accent="var(--brand-blue)" />
        <StatCard title="No leídas" value={formatNumero(resumen.noLeidas)} icon={BellRing} accent="var(--brand-orange)" />
        <StatCard title="Críticas" value={formatNumero(resumen.criticas)} icon={OctagonAlert} accent="var(--brand-magenta)" />
      </div>

      <AlertasList alertas={alertas} />
    </div>
  );
}
