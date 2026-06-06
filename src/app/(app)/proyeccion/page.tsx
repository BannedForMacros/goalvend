import type { Metadata } from "next";
import { TrendingUp, Target, TriangleAlert } from "lucide-react";
import { getProyeccion } from "@/modules/proyeccion/queries";
import { formatMoneda, formatPorcentaje, formatNumero } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EstadoBadge } from "@/components/kpi/estado";
import { ProyeccionChart } from "@/components/charts/proyeccion-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Proyección" };
export const dynamic = "force-dynamic";

export default async function ProyeccionPage() {
  const d = await getProyeccion();
  const enRiesgo = d.vendedores.filter((v) => v.enRiesgo);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyección comercial"
        description={`Estimación al cierre del mes según el ritmo actual (día ${d.diaActual} de ${d.diasMes}).`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Proyección fin de mes"
          value={formatMoneda(d.proyeccionFinMes)}
          icon={TrendingUp}
          accent="var(--brand-magenta)"
          hint={`Acumulado actual: ${formatMoneda(d.ventasMesActual)}`}
        />
        <StatCard
          title="Cumplimiento proyectado"
          value={formatPorcentaje(d.pctProyectado)}
          icon={Target}
          accent="var(--brand-blue)"
          hint={`Meta grupal: ${formatMoneda(d.metaGrupal)}`}
        />
        <StatCard
          title="Vendedores en riesgo"
          value={formatNumero(enRiesgo.length)}
          icon={TriangleAlert}
          accent="var(--brand-orange)"
          hint="no alcanzarían su meta"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia y proyección</CardTitle>
          <CardDescription>
            Ventas históricas y proyección del mes actual (en magenta)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProyeccionChart data={d.serie} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riesgo de incumplimiento por vendedor</CardTitle>
          <CardDescription>Proyección individual al cierre del mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Acumulado</TableHead>
                  <TableHead className="text-right">Proyección</TableHead>
                  <TableHead className="text-right">Meta</TableHead>
                  <TableHead className="text-right">Cumpl. proyectado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.vendedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No hay datos para proyectar.
                    </TableCell>
                  </TableRow>
                ) : (
                  d.vendedores.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.nombre}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoneda(v.ventasActual)}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatMoneda(v.proyeccion)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatMoneda(v.metaObjetivo)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm font-medium tabular-nums">
                            {formatPorcentaje(v.pctProyectado)}
                          </span>
                          <EstadoBadge estado={v.estado} showLabel={false} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
