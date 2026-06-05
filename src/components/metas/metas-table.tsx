"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, User, Users } from "lucide-react";
import { eliminarMeta } from "@/modules/metas/actions";
import type { MetaConCumplimiento } from "@/modules/metas/queries";
import { formatMoneda, formatPorcentaje, nombreMes } from "@/lib/format";
import { tipoMetaLabel, periodoMetaLabel } from "@/lib/enums";
import { ESTADO_CONFIG, EstadoBadge } from "@/components/kpi/estado";
import { MetaFormDialog, type MetaDTO } from "./meta-form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function periodoTexto(m: MetaConCumplimiento) {
  if (m.periodo === "MENSUAL" && m.mes) return `${nombreMes(m.mes)} ${m.anio}`;
  if (m.periodo === "TRIMESTRAL" && m.trimestre) return `Q${m.trimestre} ${m.anio}`;
  return String(m.anio);
}

function toDTO(m: MetaConCumplimiento): MetaDTO {
  return {
    id: m.id,
    nombre: m.nombre,
    tipo: m.tipo,
    periodo: m.periodo,
    vendedorId: m.vendedorId,
    montoObjetivo: m.montoObjetivo,
    anio: m.anio,
    mes: m.mes,
    trimestre: m.trimestre,
  };
}

export function MetasTable({
  metas,
  vendedores,
}: {
  metas: MetaConCumplimiento[];
  vendedores: { id: string; nombre: string }[];
}) {
  const [editar, setEditar] = useState<MetaConCumplimiento | null>(null);
  const [eliminar, setEliminar] = useState<MetaConCumplimiento | null>(null);
  const [pending, startTransition] = useTransition();

  function confirmar() {
    if (!eliminar) return;
    startTransition(async () => {
      const res = await eliminarMeta(eliminar.id);
      if (res.ok) toast.success("Meta eliminada");
      else toast.error(res.error ?? "Error al eliminar");
      setEliminar(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meta</TableHead>
              <TableHead>Asignación</TableHead>
              <TableHead className="text-right">Objetivo</TableHead>
              <TableHead className="text-right">Real</TableHead>
              <TableHead className="w-[220px]">Cumplimiento</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No hay metas registradas.
                </TableCell>
              </TableRow>
            ) : (
              metas.map((m) => {
                const cfg = ESTADO_CONFIG[m.estado];
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="font-medium">{m.nombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {tipoMetaLabel[m.tipo]} · {periodoMetaLabel[m.periodo]} · {periodoTexto(m)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {m.tipo === "INDIVIDUAL" ? (
                        <span className="flex items-center gap-1.5 text-sm">
                          <User className="size-3.5 text-muted-foreground" />
                          {m.vendedorNombre ?? "—"}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Users className="size-3.5" /> Grupal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoneda(m.montoObjetivo)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatMoneda(m.ventasReales)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <EstadoBadge estado={m.estado} showLabel={false} />
                          <span className="text-sm font-semibold tabular-nums">
                            {formatPorcentaje(m.pct)}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, m.pct)}%`,
                              backgroundColor: cfg.color,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditar(m)}>
                            <Pencil className="size-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-danger focus:text-danger"
                            onClick={() => setEliminar(m)}
                          >
                            <Trash2 className="size-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {editar && (
        <MetaFormDialog
          meta={toDTO(editar)}
          vendedores={vendedores}
          open
          onOpenChange={(o) => !o && setEditar(null)}
        />
      )}

      <Dialog open={!!eliminar} onOpenChange={(o) => !o && setEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar meta</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar la meta &quot;{eliminar?.nombre}&quot;? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmar} disabled={pending}>
              {pending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
