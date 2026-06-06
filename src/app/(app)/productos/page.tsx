import type { Metadata } from "next";
import { Package, Tag, DollarSign } from "lucide-react";
import { getProductos, getProductosResumen } from "@/modules/productos/queries";
import { formatMoneda, formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProductoFormDialog } from "@/components/productos/producto-form-dialog";
import { ProductosTable } from "@/components/productos/productos-table";

export const metadata: Metadata = { title: "Productos" };
export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const [productos, resumen] = await Promise.all([getProductos(), getProductosResumen()]);

  return (
    <div className="space-y-6">
      <PageHeader title="Productos" description="Catálogo de productos y servicios.">
        <ProductoFormDialog />
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Productos activos" value={formatNumero(resumen.total)} icon={Package} accent="var(--brand-blue)" />
        <StatCard title="Categorías" value={formatNumero(resumen.categorias)} icon={Tag} accent="var(--brand-purple)" />
        <StatCard title="Precio promedio" value={formatMoneda(resumen.precioPromedio)} icon={DollarSign} accent="var(--brand-green)" />
      </div>

      <ProductosTable productos={productos} />
    </div>
  );
}
