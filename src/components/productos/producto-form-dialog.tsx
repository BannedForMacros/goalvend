"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { productoSchema, type ProductoInput } from "@/modules/productos/schema";
import { crearProducto, actualizarProducto } from "@/modules/productos/actions";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface ProductoDTO extends ProductoInput {
  id: string;
}

interface Props {
  producto?: ProductoDTO;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProductoFormDialog({ producto, open: openProp, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? openProp : openState;
  const setOpen = (o: boolean) => (controlado ? onOpenChange?.(o) : setOpenState(o));
  const [pending, startTransition] = useTransition();
  const editando = !!producto;

  const form = useForm<ProductoInput>({
    resolver: zodResolver(productoSchema) as Resolver<ProductoInput>,
    defaultValues: producto ?? {
      nombre: "",
      sku: "",
      descripcion: "",
      precio: 100,
      categoria: "",
    },
  });

  function onSubmit(values: ProductoInput) {
    startTransition(async () => {
      const res = editando
        ? await actualizarProducto(producto!.id, values)
        : await crearProducto(values);
      if (res.ok) {
        toast.success(editando ? "Producto actualizado" : "Producto creado");
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
            <Plus className="size-4" /> Nuevo producto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>Registra un producto o servicio del catálogo.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Licencia CRM Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (S/)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Software" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="GV-1001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Breve descripción del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Guardando…" : editando ? "Guardar cambios" : "Crear producto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
