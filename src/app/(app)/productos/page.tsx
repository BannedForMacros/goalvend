import { PageHeader } from "@/components/ui/page-header";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata = { title: "Productos" };

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Productos" description="Catálogo de productos y servicios." />
      <ComingSoon modulo="Productos" detalle="Catálogo de productos/servicios con precios y categorías." />
    </div>
  );
}
