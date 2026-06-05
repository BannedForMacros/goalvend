import { User, Users } from "lucide-react";
import type { MetaConCumplimiento } from "@/modules/metas/queries";
import { formatMoneda, formatPorcentaje } from "@/lib/format";
import { ESTADO_CONFIG, EstadoBadge } from "@/components/kpi/estado";
import { Card, CardContent } from "@/components/ui/card";

export function IndicadorCard({ meta }: { meta: MetaConCumplimiento }) {
  const cfg = ESTADO_CONFIG[meta.estado];

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: cfg.color }} />
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold leading-tight">{meta.nombre}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              {meta.tipo === "INDIVIDUAL" ? (
                <>
                  <User className="size-3.5" /> {meta.vendedorNombre ?? "—"}
                </>
              ) : (
                <>
                  <Users className="size-3.5" /> Meta grupal
                </>
              )}
            </p>
          </div>
          <EstadoBadge estado={meta.estado} showLabel={false} />
        </div>

        <div className="flex items-end justify-between">
          <span className="text-4xl font-extrabold tracking-tight" style={{ color: cfg.color }}>
            {formatPorcentaje(meta.pct)}
          </span>
          <span className="text-xs text-muted-foreground">{cfg.label}</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(100, meta.pct)}%`, backgroundColor: cfg.color }}
          />
        </div>

        {/* Desglose de la fórmula: Cumplimiento = Real / Objetivo × 100 */}
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs">
          <div>
            <p className="text-muted-foreground">Ventas reales</p>
            <p className="font-semibold">{formatMoneda(meta.ventasReales)}</p>
          </div>
          <span className="text-muted-foreground">/</span>
          <div className="text-right">
            <p className="text-muted-foreground">Meta</p>
            <p className="font-semibold">{formatMoneda(meta.montoObjetivo)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
