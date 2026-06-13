import type { Metadata } from "next";
import { DollarSign, ShoppingCart, Receipt } from "lucide-react";
import { getVentas, getVentasResumen, getOpcionesVenta } from "@/modules/ventas/queries";
import { formatMoneda, formatNumero } from "@/lib/format";
import { resolverRango } from "@/lib/rango-fechas";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { VentaFormDialog } from "@/components/ventas/venta-form-dialog";
import { VentasTable } from "@/components/ventas/ventas-table";
import { VentasFilters } from "@/components/ventas/ventas-filters";

export const metadata: Metadata = { title: "Ventas" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ preset?: string; desde?: string; hasta?: string }>;
}

export default async function VentasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { rango, label } = resolverRango(sp);

  const [ventas, resumen, opciones] = await Promise.all([
    getVentas(rango),
    getVentasResumen(rango),
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

      <VentasFilters />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Ventas del periodo"
          value={formatMoneda(resumen.total)}
          icon={DollarSign}
          accent="var(--brand-blue)"
          hint={label}
        />
        <StatCard
          title="Operaciones"
          value={formatNumero(resumen.operaciones)}
          icon={ShoppingCart}
          accent="var(--brand-cyan)"
          hint={label}
        />
        <StatCard
          title="Ticket promedio"
          value={formatMoneda(resumen.ticketPromedio)}
          icon={Receipt}
          accent="var(--brand-green)"
          hint="por operación"
        />
      </div>

      <VentasTable ventas={ventas} />
    </div>
  );
}
