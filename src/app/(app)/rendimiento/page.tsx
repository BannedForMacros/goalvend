import type { Metadata } from "next";
import { Trophy, Medal, Award } from "lucide-react";
import {
  getRendimientoVendedores,
  getEvolucionVentas,
} from "@/modules/rendimiento/queries";
import { formatMoneda, formatNumero, formatPorcentaje } from "@/lib/format";
import { PageHeader } from "@/components/ui/page-header";
import { EstadoBadge } from "@/components/kpi/estado";
import { VentasAreaChart } from "@/components/charts/ventas-area-chart";
import { RankingBarChart } from "@/components/charts/ranking-bar-chart";
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

export const metadata: Metadata = { title: "Rendimiento" };
export const dynamic = "force-dynamic";

const MEDALLAS = [
  { icon: Trophy, color: "var(--brand-orange)" },
  { icon: Medal, color: "var(--brand-cyan)" },
  { icon: Award, color: "var(--brand-purple)" },
];

export default async function RendimientoPage() {
  const [vendedores, evolucion] = await Promise.all([
    getRendimientoVendedores(),
    getEvolucionVentas(),
  ]);

  const ranking = vendedores.map((v) => ({ nombre: v.nombre, total: Math.round(v.ventasMes) }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análisis de rendimiento"
        description="Ranking comercial, comparación entre vendedores y evolución de productividad."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Comparativa de vendedores</CardTitle>
            <CardDescription>Ventas del mes en curso</CardDescription>
          </CardHeader>
          <CardContent>
            <RankingBarChart data={ranking} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolución de productividad</CardTitle>
            <CardDescription>Ventas totales · últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <VentasAreaChart data={evolucion} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking comercial</CardTitle>
          <CardDescription>Desempeño individual del mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">#</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Operaciones</TableHead>
                  <TableHead className="text-right">Ticket prom.</TableHead>
                  <TableHead className="text-right">Cumplimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendedores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No hay datos de vendedores.
                    </TableCell>
                  </TableRow>
                ) : (
                  vendedores.map((v, i) => {
                    const medalla = MEDALLAS[i];
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="text-center">
                          {medalla ? (
                            <medalla.icon
                              className="mx-auto size-5"
                              style={{ color: medalla.color }}
                            />
                          ) : (
                            <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{v.nombre}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          {formatMoneda(v.ventasMes)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumero(v.operaciones)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatMoneda(v.ticketPromedio)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm font-medium tabular-nums">
                              {formatPorcentaje(v.pct)}
                            </span>
                            <EstadoBadge estado={v.estado} showLabel={false} />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
