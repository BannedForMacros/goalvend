"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { eliminarProducto } from "@/modules/productos/actions";
import type { ProductoRow } from "@/modules/productos/queries";
import { formatMoneda } from "@/lib/format";
import { ProductoFormDialog } from "./producto-form-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export function ProductosTable({ productos }: { productos: ProductoRow[] }) {
  const [query, setQuery] = useState("");
  const [editar, setEditar] = useState<ProductoRow | null>(null);
  const [eliminar, setEliminar] = useState<ProductoRow | null>(null);
  const [pending, startTransition] = useTransition();

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q),
    );
  }, [productos, query]);

  function confirmar() {
    if (!eliminar) return;
    startTransition(async () => {
      const res = await eliminarProducto(eliminar.id);
      if (res.ok) toast.success("Producto eliminado");
      else toast.error(res.error ?? "Error al eliminar");
      setEliminar(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, SKU o categoría…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((p) => (
                <TableRow key={p.id} className={p.activo ? "" : "opacity-50"}>
                  <TableCell>
                    <div className="font-medium">{p.nombre}</div>
                    {p.descripcion && (
                      <div className="text-xs text-muted-foreground">{p.descripcion}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.sku || "—"}</TableCell>
                  <TableCell>
                    {p.categoria ? <Badge variant="secondary">{p.categoria}</Badge> : "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatMoneda(p.precio)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{p.ventasCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditar(p)}>
                          <Pencil className="size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-danger focus:text-danger"
                          onClick={() => setEliminar(p)}
                        >
                          <Trash2 className="size-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editar && (
        <ProductoFormDialog
          producto={{
            id: editar.id,
            nombre: editar.nombre,
            sku: editar.sku,
            descripcion: editar.descripcion,
            precio: editar.precio,
            categoria: editar.categoria,
          }}
          open
          onOpenChange={(o) => !o && setEditar(null)}
        />
      )}

      <Dialog open={!!eliminar} onOpenChange={(o) => !o && setEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar producto</DialogTitle>
            <DialogDescription>
              {eliminar?.ventasCount
                ? `"${eliminar.nombre}" tiene ventas registradas, por lo que se desactivará en lugar de borrarse.`
                : `¿Seguro que deseas eliminar "${eliminar?.nombre}"?`}
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
