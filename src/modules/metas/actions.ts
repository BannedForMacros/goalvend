"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rangoMensual, rangoTrimestral } from "@/lib/periodo";
import { sincronizarAlertasVendedor } from "@/modules/alertas/engine";
import { metaSchema, type MetaInput } from "./schema";

export type ActionResult = { ok: boolean; error?: string };

function construirDatos(input: MetaInput) {
  const esMensual = input.periodo === "MENSUAL";
  const { inicio, fin } = esMensual
    ? rangoMensual(input.anio, input.mes!)
    : rangoTrimestral(input.anio, input.trimestre!);

  return {
    nombre: input.nombre.trim(),
    tipo: input.tipo,
    periodo: input.periodo,
    montoObjetivo: input.montoObjetivo,
    anio: input.anio,
    mes: esMensual ? input.mes! : null,
    trimestre: esMensual ? null : input.trimestre!,
    fechaInicio: inicio,
    fechaFin: fin,
    vendedorId: input.tipo === "INDIVIDUAL" ? input.vendedorId || null : null,
  };
}

export async function crearMeta(input: MetaInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado" };
  const parsed = metaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const datos = construirDatos(parsed.data);
  try {
    await prisma.meta.create({ data: datos });
  } catch {
    return { ok: false, error: "No se pudo crear la meta." };
  }
  if (datos.vendedorId) await sincronizarAlertasVendedor(datos.vendedorId);
  revalidatePath("/metas");
  revalidatePath("/indicadores");
  return { ok: true };
}

export async function actualizarMeta(id: string, input: MetaInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado" };
  const parsed = metaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const datos = construirDatos(parsed.data);
  try {
    await prisma.meta.update({ where: { id }, data: datos });
  } catch {
    return { ok: false, error: "No se pudo actualizar la meta." };
  }
  if (datos.vendedorId) await sincronizarAlertasVendedor(datos.vendedorId);
  revalidatePath("/metas");
  revalidatePath("/indicadores");
  return { ok: true };
}

export async function eliminarMeta(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado" };
  try {
    await prisma.alerta.deleteMany({ where: { metaId: id } });
    await prisma.meta.delete({ where: { id } });
  } catch {
    return { ok: false, error: "No se pudo eliminar la meta." };
  }
  revalidatePath("/metas");
  revalidatePath("/indicadores");
  return { ok: true };
}
