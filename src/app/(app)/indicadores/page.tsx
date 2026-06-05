import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import { getMetasConCumplimiento, getMetasResumen } from "@/modules/metas/queries";
import { formatPorcentaje } from "@/lib/format";
import { UMBRAL_ALTO, UMBRAL_MODERADO } from "@/lib/kpi";
import { PageHeader } from "@/components/ui/page-header";
import { IndicadorCard } from "@/components/kpi/indicador-card";
import { EstadoIcono } from "@/components/kpi/estado";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Indicadores KPI" };
export const dynamic = "force-dynamic";

export default async function IndicadoresPage() {
  const metas = await getMetasConCumplimiento();
  const resumen = await getMetasResumen(metas);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicadores KPI"
        description="Cálculo automático del cumplimiento comercial por meta."
      />

      {/* Fórmula + semáforo */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="size-5 text-[var(--brand-blue)]" /> Fórmula de cumplimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/50 p-4 text-sm">
              <span className="font-semibold">Cumplimiento Comercial</span>
              <span className="text-muted-foreground">=</span>
              <span className="flex flex-col items-center">
                <span className="border-b px-2 pb-1">Ventas Reales</span>
                <span className="px-2 pt-1">Meta Establecida</span>
              </span>
              <span className="text-muted-foreground">× 100</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <EstadoIcono estado="ALTO" className="size-4" /> Alto: ≥ {UMBRAL_ALTO}%
              </span>
              <span className="flex items-center gap-1.5">
                <EstadoIcono estado="MODERADO" className="size-4" /> Moderado: {UMBRAL_MODERADO}–
                {UMBRAL_ALTO - 1}%
              </span>
              <span className="flex items-center gap-1.5">
                <EstadoIcono estado="BAJO" className="size-4" /> Bajo: &lt; {UMBRAL_MODERADO}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen del semáforo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <EstadoIcono estado="ALTO" className="size-4" /> Alto desempeño
              </span>
              <span className="font-bold text-success">{resumen.alto}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <EstadoIcono estado="MODERADO" className="size-4" /> Rendimiento moderado
              </span>
              <span className="font-bold text-warning">{resumen.moderado}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <EstadoIcono estado="BAJO" className="size-4" /> Bajo cumplimiento
              </span>
              <span className="font-bold text-danger">{resumen.bajo}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Promedio general</span>
              <span className="text-lg font-bold">{formatPorcentaje(resumen.promedio)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores por meta */}
      {metas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay metas para calcular indicadores. Crea metas en el módulo correspondiente.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metas.map((m) => (
            <IndicadorCard key={m.id} meta={m} />
          ))}
        </div>
      )}
    </div>
  );
}
