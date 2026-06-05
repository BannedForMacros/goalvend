import type { Metadata } from "next";
import { DollarSign, ShoppingCart, Receipt } from "lucide-react";
import { getVentas, getVentasResumen, getOpcionesVenta } from "@/modules/ventas/queries";
import { formatMoneda, formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { VentaFormDialog } from "@/components/ventas/venta-form-dialog";
import { VentasTable } from "@/components/ventas/ventas-table";

export const metadata: Metadata = { title: "Ventas" };
export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const [ventas, resumen, opciones] = await Promise.all([
    getVentas(),
    getVentasResumen(),
    getOpcionesVenta(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas inteligentes"
        description="Registro y consolidación de operaciones comerciales."
      >
        <VentaFormDialog opciones={opciones} />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Ventas del mes" value={formatMoneda(resumen.totalMes)} icon={DollarSign} accent="var(--brand-blue)" />
        <StatCard title="Operaciones del mes" value={formatNumero(resumen.operacionesMes)} icon={ShoppingCart} accent="var(--brand-cyan)" />
        <StatCard title="Ticket promedio" value={formatMoneda(resumen.ticketPromedio)} icon={Receipt} accent="var(--brand-green)" />
      </div>

      <VentasTable ventas={ventas} />
    </div>
  );
}
