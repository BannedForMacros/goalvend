import type { Metadata } from "next";
import Link from "next/link";
import { FileSpreadsheet, FileText, ShoppingCart, Target, Trophy, Users } from "lucide-react";
import { REPORTES, type ReporteTipo } from "@/modules/reportes/data";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Reportes" };

const ICONOS: Record<ReporteTipo, typeof ShoppingCart> = {
  ventas: ShoppingCart,
  metas: Target,
  rendimiento: Trophy,
  clientes: Users,
};

const ACENTOS: Record<ReporteTipo, string> = {
  ventas: "var(--brand-blue)",
  metas: "var(--brand-cyan)",
  rendimiento: "var(--brand-green)",
  clientes: "var(--brand-purple)",
};

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes inteligentes"
        description="Genera y exporta reportes gerenciales en Excel y PDF."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {REPORTES.map((r) => {
          const Icon = ICONOS[r.tipo];
          const accent = ACENTOS[r.tipo];
          return (
            <Card key={r.tipo}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
                      color: accent,
                    }}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle>{r.nombre}</CardTitle>
                    <CardDescription className="mt-1">{r.descripcion}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link
                    href={`/api/reportes?reporte=${r.tipo}&formato=excel`}
                    prefetch={false}
                    target="_blank"
                  >
                    <FileSpreadsheet className="size-4 text-success" /> Excel
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link
                    href={`/api/reportes?reporte=${r.tipo}&formato=pdf`}
                    prefetch={false}
                    target="_blank"
                  >
                    <FileText className="size-4 text-danger" /> PDF
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
