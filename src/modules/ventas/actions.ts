"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/format";
import { sincronizarAlertasVendedor } from "@/modules/alertas/engine";
import { ventaSchema, type VentaInput } from "./schema";

export type ActionResult = { ok: boolean; error?: string };

export async function crearVenta(input: VentaInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado" };

  const parsed = ventaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const data = parsed.data;

  const producto = await prisma.producto.findUnique({ where: { id: data.productoId } });
  if (!producto) return { ok: false, error: "Producto no encontrado." };

  const precio = toNumber(producto.precio);
  const total = precio * data.cantidad;

  try {
    await prisma.venta.create({
      data: {
        clienteId: data.clienteId,
        productoId: data.productoId,
        vendedorId: data.vendedorId,
        cantidad: data.cantidad,
        precioUnitario: precio,
        total,
        fecha: data.fecha ? new Date(data.fecha) : new Date(),
      },
    });
  } catch {
    return { ok: false, error: "No se pudo registrar la venta." };
  }

  // Regla automatizada: "Si aumentan las ventas → recalcula indicadores / alertas".
  await sincronizarAlertasVendedor(data.vendedorId);

  revalidatePath("/ventas");
  revalidatePath("/dashboard");
  revalidatePath("/indicadores");
  revalidatePath("/alertas");
  return { ok: true };
}

export async function eliminarVenta(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "No autorizado" };

  try {
    const venta = await prisma.venta.delete({ where: { id } });
    await sincronizarAlertasVendedor(venta.vendedorId);
  } catch {
    return { ok: false, error: "No se pudo eliminar la venta." };
  }
  revalidatePath("/ventas");
  revalidatePath("/dashboard");
  return { ok: true };
}
