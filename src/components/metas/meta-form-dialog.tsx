"use client";

import { useState, useTransition } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { metaSchema, type MetaInput } from "@/modules/metas/schema";
import { crearMeta, actualizarMeta } from "@/modules/metas/actions";
import { tipoMetaOptions, periodoMetaOptions } from "@/lib/enums";
import { MESES_OPCIONES, TRIMESTRES_OPCIONES } from "@/lib/periodo";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MetaDTO {
  id: string;
  nombre: string;
  tipo: "INDIVIDUAL" | "GRUPAL";
  periodo: "MENSUAL" | "TRIMESTRAL";
  vendedorId: string | null;
  montoObjetivo: number;
  anio: number;
  mes: number | null;
  trimestre: number | null;
}

interface Props {
  meta?: MetaDTO;
  vendedores: { id: string; nombre: string }[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MetaFormDialog({ meta, vendedores, open: openProp, onOpenChange }: Props) {
  const [openState, setOpenState] = useState(false);
  const controlado = openProp !== undefined;
  const open = controlado ? openProp : openState;
  const setOpen = (o: boolean) => (controlado ? onOpenChange?.(o) : setOpenState(o));
  const [pending, startTransition] = useTransition();
  const editando = !!meta;
  const anioActual = new Date().getFullYear();

  const form = useForm<MetaInput>({
    resolver: zodResolver(metaSchema) as Resolver<MetaInput>,
    defaultValues: meta
      ? {
          nombre: meta.nombre,
          tipo: meta.tipo,
          periodo: meta.periodo,
          vendedorId: meta.vendedorId ?? "",
          montoObjetivo: meta.montoObjetivo,
          anio: meta.anio,
          mes: meta.mes ?? undefined,
          trimestre: meta.trimestre ?? undefined,
        }
      : {
          nombre: "",
          tipo: "INDIVIDUAL",
          periodo: "MENSUAL",
          vendedorId: "",
          montoObjetivo: 10000,
          anio: anioActual,
          mes: new Date().getMonth() + 1,
          trimestre: Math.floor(new Date().getMonth() / 3) + 1,
        },
  });

  const tipo = form.watch("tipo");
  const periodo = form.watch("periodo");

  function onSubmit(values: MetaInput) {
    startTransition(async () => {
      const res = editando
        ? await actualizarMeta(meta!.id, values)
        : await crearMeta(values);
      if (res.ok) {
        toast.success(editando ? "Meta actualizada" : "Meta creada");
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
            <Plus className="size-4" /> Nueva meta
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar meta" : "Nueva meta"}</DialogTitle>
          <DialogDescription>
            Configura una meta comercial individual o grupal por periodo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Meta mensual de ventas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipoMetaOptions.map((o) => (
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
              <FormField
                control={form.control}
                name="periodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {periodoMetaOptions.map((o) => (
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

            {tipo === "INDIVIDUAL" && (
              <FormField
                control={form.control}
                name="vendedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un vendedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendedores.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="montoObjetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo (S/)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="anio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input type="number" min={2020} max={2100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {periodo === "MENSUAL" ? (
              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MESES_OPCIONES.map((o) => (
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
            ) : (
              <FormField
                control={form.control}
                name="trimestre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trimestre</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el trimestre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRIMESTRES_OPCIONES.map((o) => (
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
            )}

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Guardando…" : editando ? "Guardar cambios" : "Crear meta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
