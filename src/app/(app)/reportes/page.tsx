import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ReportesPanel } from "@/components/reportes/reportes-panel";

export const metadata: Metadata = { title: "Reportes" };

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes inteligentes"
        description="Genera y exporta reportes gerenciales en Excel y PDF."
      />
      <ReportesPanel />
    </div>
  );
}
