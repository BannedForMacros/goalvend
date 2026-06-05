import type { Metadata } from "next";
import { DollarSign, Users, ShoppingCart, Receipt } from "lucide-react";
import { getDashboardData } from "@/modules/dashboard/queries";
import { formatMoneda, formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { CumplimientoGauge } from "@/components/dashboard/cumplimiento-gauge";
import { EstadoIcono } from "@/components/kpi/estado";
import { VentasAreaChart } from "@/components/charts/ventas-area-chart";
import { RankingBarChart } from "@/components/charts/ranking-bar-chart";
import { SegmentoDonutChart } from "@/components/charts/segmento-donut-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Panel general" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const d = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel general"
        description="Resumen del rendimiento comercial del mes en curso."
      />

      {/* KPIs principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas del mes"
          value={formatMoneda(d.ventasMes)}
          icon={DollarSign}
          accent="var(--brand-blue)"
          trend={d.variacion}
        />
        <StatCard
          title="Operaciones"
          value={formatNumero(d.operacionesMes)}
          icon={ShoppingCart}
          accent="var(--brand-cyan)"
          hint="ventas registradas este mes"
        />
        <StatCard
          title="Ticket promedio"
          value={formatMoneda(d.ticketPromedio)}
          icon={Receipt}
          accent="var(--brand-green)"
          hint="por operación"
        />
        <StatCard
          title="Clientes activos"
          value={formatNumero(d.totalClientes)}
          icon={Users}
          accent="var(--brand-orange)"
          hint="en cartera comercial"
        />
      </div>

      {/* Cumplimiento + evolución */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Cumplimiento global</CardTitle>
            <CardDescription>Ventas vs. meta grupal del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <CumplimientoGauge pct={d.cumplimientoGlobal} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-success/10 p-2">
                <p className="text-lg font-bold text-success">{d.semaforo.alto}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <EstadoIcono estado="ALTO" className="size-3.5" /> Alto
                </p>
              </div>
              <div className="rounded-lg bg-warning/10 p-2">
                <p className="text-lg font-bold text-warning">{d.semaforo.moderado}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <EstadoIcono estado="MODERADO" className="size-3.5" /> Moderado
                </p>
              </div>
              <div className="rounded-lg bg-danger/10 p-2">
                <p className="text-lg font-bold text-danger">{d.semaforo.bajo}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <EstadoIcono estado="BAJO" className="size-3.5" /> Bajo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolución de ventas</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <VentasAreaChart data={d.serieMensual} />
          </CardContent>
        </Card>
      </div>

      {/* Ranking + segmentos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking comercial</CardTitle>
            <CardDescription>Top vendedores del mes</CardDescription>
          </CardHeader>
          <CardContent>
            <RankingBarChart data={d.ranking} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas por segmento</CardTitle>
            <CardDescription>Distribución de la cartera</CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentoDonutChart data={d.porSegmento} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
