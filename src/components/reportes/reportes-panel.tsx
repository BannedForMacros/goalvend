"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarRange,
  FileSpreadsheet,
  FileText,
  ShoppingCart,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { REPORTES, type ReporteTipo } from "@/modules/reportes/catalogo";
import { type RangoValue } from "@/components/ui/date-range-filter";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ICONOS: Record<ReporteTipo, LucideIcon> = {
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

export function ReportesPanel() {
  const [rango, setRango] = useState<RangoValue>({ preset: "mes", desde: "", hasta: "" });

  function hrefFor(tipo: ReporteTipo, formato: "excel" | "pdf", usaFecha: boolean) {
    const sp = new URLSearchParams({ reporte: tipo, formato });
    if (usaFecha) {
      sp.set("preset", rango.preset);
      if (rango.preset === "personalizado") {
        if (rango.desde) sp.set("desde", rango.desde);
        if (rango.hasta) sp.set("hasta", rango.hasta);
      }
    }
    return `/api/reportes?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarRange className="size-4" />
            El filtro de fecha aplica a los reportes transaccionales (Ventas).
          </div>
          <DateRangeFilter value={rango} onChange={setRango} />
        </CardContent>
      </Card>

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
                    <CardTitle className="flex items-center gap-2">
                      {r.nombre}
                      {r.usaFecha && (
                        <Badge variant="secondary" className="gap-1 text-xs font-normal">
                          <CalendarRange className="size-3" /> Por fecha
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">{r.descripcion}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={hrefFor(r.tipo, "excel", r.usaFecha)} prefetch={false} target="_blank">
                    <FileSpreadsheet className="size-4 text-success" /> Excel
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={hrefFor(r.tipo, "pdf", r.usaFecha)} prefetch={false} target="_blank">
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
