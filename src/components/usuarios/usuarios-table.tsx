"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Power, PowerOff } from "lucide-react";
import { toggleUsuarioActivo } from "@/modules/usuarios/actions";
import type { UsuarioRow } from "@/modules/usuarios/queries";
import { rolLabel } from "@/lib/enums";
import { UsuarioFormDialog } from "./usuario-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const ROL_COLOR: Record<UsuarioRow["rol"], string> = {
  ADMIN: "bg-danger/15 text-danger border-danger/30",
  GERENTE: "bg-[var(--brand-purple)]/15 text-[var(--brand-purple)] border-[var(--brand-purple)]/30",
  SUPERVISOR: "bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] border-[var(--brand-blue)]/30",
  VENDEDOR: "bg-success/15 text-success border-success/30",
  MARKETING: "bg-warning/15 text-warning border-warning/30",
};

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function UsuariosTable({ usuarios }: { usuarios: UsuarioRow[] }) {
  const [editar, setEditar] = useState<UsuarioRow | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(u: UsuarioRow) {
    startTransition(async () => {
      const res = await toggleUsuarioActivo(u.id, !u.activo);
      if (res.ok) toast.success(u.activo ? "Usuario desactivado" : "Usuario activado");
      else toast.error(res.error ?? "Error");
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id} className={u.activo ? "" : "opacity-50"}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-[var(--brand-navy)] text-xs font-semibold text-white">
                        {iniciales(u.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{u.nombre}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={ROL_COLOR[u.rol]}>
                    {rolLabel[u.rol]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.activo ? (
                    <span className="flex items-center gap-1.5 text-sm text-success">
                      <Power className="size-3.5" /> Activo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <PowerOff className="size-3.5" /> Inactivo
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">{u.ventasCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditar(u)}>
                        <Pencil className="size-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggle(u)} disabled={pending}>
                        {u.activo ? (
                          <>
                            <PowerOff className="size-4" /> Desactivar
                          </>
                        ) : (
                          <>
                            <Power className="size-4" /> Activar
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editar && (
        <UsuarioFormDialog
          usuario={{
            id: editar.id,
            nombre: editar.nombre,
            email: editar.email,
            rol: editar.rol,
            telefono: editar.telefono,
          }}
          open
          onOpenChange={(o) => !o && setEditar(null)}
        />
      )}
    </div>
  );
}
