"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { usuarioSchema, type UsuarioInput } from "@/modules/usuarios/schema";
import { crearUsuario, actualizarUsuario } from "@/modules/usuarios/actions";
import { rolOptions } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UsuarioDTO {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioInput["rol"];
  telefono: string;
}

interface Props {
  usuario?: UsuarioDTO;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UsuarioFormDialog({ usuario, open: openProp, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? openProp : openState;
  const setOpen = (o: boolean) => (controlado ? onOpenChange?.(o) : setOpenState(o));
  const [pending, startTransition] = useTransition();
  const editando = !!usuario;

  const form = useForm<UsuarioInput>({
    resolver: zodResolver(usuarioSchema) as Resolver<UsuarioInput>,
    defaultValues: usuario
      ? { ...usuario, password: "" }
      : { nombre: "", email: "", rol: "VENDEDOR", telefono: "", password: "" },
  });

  function onSubmit(values: UsuarioInput) {
    startTransition(async () => {
      const res = editando
        ? await actualizarUsuario(usuario!.id, values)
        : await crearUsuario(values);
      if (res.ok) {
        toast.success(editando ? "Usuario actualizado" : "Usuario creado");
        setOpen(false);
        if (!editando) form.reset();
      } else {
        toast.error(res.error ?? "Ocurrió un error");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlado && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" /> Nuevo usuario
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Actualiza los datos del usuario y su rol."
              : "Crea un usuario con su rol de acceso al sistema."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="usuario@goalvend.pe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rolOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{editando ? "Nueva contraseña" : "Contraseña"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    {editando ? "Déjala vacía para no cambiarla." : "Mínimo 6 caracteres."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Guardando…" : editando ? "Guardar cambios" : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
