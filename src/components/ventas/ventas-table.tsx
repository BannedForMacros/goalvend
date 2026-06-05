"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";
import { eliminarVenta } from "@/modules/ventas/actions";
import type { VentaRow } from "@/modules/ventas/queries";
import { formatMoneda, formatFecha } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function VentasTable({ ventas }: { ventas: VentaRow[] }) {
  const [query, setQuery] = useState("");
  const [eliminar, setEliminar] = useState<VentaRow | null>(null);
  const [pending, startTransition] = useTransition();

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ventas;
    return ventas.filter(
      (v) =>
        v.cliente.toLowerCase().includes(q) ||
        v.producto.toLowerCase().includes(q) ||
        v.vendedor.toLowerCase().includes(q),
    );
  }, [ventas, query]);

  function confirmar() {
    if (!eliminar) return;
    startTransition(async () => {
      const res = await eliminarVenta(eliminar.id);
      if (res.ok) toast.success("Venta eliminada");
      else toast.error(res.error ?? "Error al eliminar");
      setEliminar(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por cliente, producto o vendedor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead className="text-right">Cant.</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            ) : (
              filtradas.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatFecha(v.fecha)}</TableCell>
                  <TableCell className="font-medium">{v.cliente}</TableCell>
                  <TableCell className="text-sm">{v.producto}</TableCell>
                  <TableCell className="text-sm">{v.vendedor}</TableCell>
                  <TableCell className="text-right tabular-nums">{v.cantidad}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatMoneda(v.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-danger hover:text-danger"
                      onClick={() => setEliminar(v)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!eliminar} onOpenChange={(o) => !o && setEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar venta</DialogTitle>
            <DialogDescription>
              ¿Eliminar la venta de {eliminar?.producto} a {eliminar?.cliente}? Esta acción
              recalculará los indicadores.
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
