"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productoSchema, type ProductoInput } from "./schema";

export type ActionResult = { ok: boolean; error?: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

function normalize(input: ProductoInput) {
  return {
    nombre: input.nombre.trim(),
    sku: input.sku?.trim() || null,
    descripcion: input.descripcion?.trim() || null,
    precio: input.precio,
    categoria: input.categoria?.trim() || null,
  };
}

export async function crearProducto(input: ProductoInput): Promise<ActionResult> {
  await requireSession();
  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  try {
    await prisma.producto.create({ data: normalize(parsed.data) });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique"))
      return { ok: false, error: "Ya existe un producto con ese SKU." };
    return { ok: false, error: "No se pudo crear el producto." };
  }
  revalidatePath("/productos");
  return { ok: true };
}

export async function actualizarProducto(id: string, input: ProductoInput): Promise<ActionResult> {
  await requireSession();
  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  try {
    await prisma.producto.update({ where: { id }, data: normalize(parsed.data) });
  } catch {
    return { ok: false, error: "No se pudo actualizar el producto." };
  }
  revalidatePath("/productos");
  return { ok: true };
}

export async function eliminarProducto(id: string): Promise<ActionResult> {
  await requireSession();
  try {
    const ventas = await prisma.venta.count({ where: { productoId: id } });
    if (ventas > 0) {
      await prisma.producto.update({ where: { id }, data: { activo: false } });
    } else {
      await prisma.producto.delete({ where: { id } });
    }
  } catch {
    return { ok: false, error: "No se pudo eliminar el producto." };
  }
  revalidatePath("/productos");
  return { ok: true };
}
