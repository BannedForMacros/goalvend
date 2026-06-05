"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { eliminarCliente } from "@/modules/clientes/actions";
import {
  segmentoLabel,
  nivelActividadLabel,
  nivelActividadColor,
  tipoDocumentoLabel,
} from "@/lib/enums";
import { ClienteFormDialog, type ClienteDTO } from "./cliente-form-dialog";
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

export interface ClienteRow extends ClienteDTO {
  activo: boolean;
  ventasCount: number;
}

export function ClientesTable({ clientes }: { clientes: ClienteRow[] }) {
  const [query, setQuery] = useState("");
  const [editar, setEditar] = useState<ClienteRow | null>(null);
  const [eliminar, setEliminar] = useState<ClienteRow | null>(null);
  const [pending, startTransition] = useTransition();

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.razonSocial.toLowerCase().includes(q) ||
        c.documento.includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [clientes, query]);

  function confirmarEliminar() {
    if (!eliminar) return;
    startTransition(async () => {
      const res = await eliminarCliente(eliminar.id);
      if (res.ok) toast.success("Cliente eliminado");
      else toast.error(res.error ?? "Error al eliminar");
      setEliminar(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, documento o correo…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron clientes.
                </TableCell>
              </TableRow>
            ) : (
              filtrados.map((c) => (
                <TableRow key={c.id} className={c.activo ? "" : "opacity-50"}>
                  <TableCell>
                    <div className="font-medium">{c.razonSocial}</div>
                    {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className="text-muted-foreground">{tipoDocumentoLabel[c.tipoDocumento]}</span>{" "}
                    {c.documento}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{segmentoLabel[c.segmento]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={nivelActividadColor(c.nivelActividad)}>
                      {nivelActividadLabel[c.nivelActividad]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.ventasCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditar(c)}>
                          <Pencil className="size-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-danger focus:text-danger"
                          onClick={() => setEliminar(c)}
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

      {/* Edición (controlada) */}
      {editar && (
        <ClienteFormDialog
          cliente={editar}
          open
          onOpenChange={(o) => !o && setEditar(null)}
        />
      )}

      {/* Confirmación de borrado */}
      <Dialog open={!!eliminar} onOpenChange={(o) => !o && setEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar cliente</DialogTitle>
            <DialogDescription>
              {eliminar?.ventasCount
                ? `"${eliminar.razonSocial}" tiene ventas registradas, por lo que se desactivará en lugar de borrarse.`
                : `¿Seguro que deseas eliminar a "${eliminar?.razonSocial}"? Esta acción no se puede deshacer.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEliminar} disabled={pending}>
              {pending ? "Eliminando…" : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
