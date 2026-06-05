"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clienteSchema, type ClienteInput } from "./schema";

export type ActionResult = { ok: boolean; error?: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  return session;
}

function normalize(input: ClienteInput) {
  return {
    razonSocial: input.razonSocial.trim(),
    tipoDocumento: input.tipoDocumento,
    documento: input.documento.trim(),
    segmento: input.segmento,
    nivelActividad: input.nivelActividad,
    email: input.email?.trim() || null,
    telefono: input.telefono?.trim() || null,
    direccion: input.direccion?.trim() || null,
  };
}

export async function crearCliente(input: ClienteInput): Promise<ActionResult> {
  await requireSession();
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  try {
    await prisma.cliente.create({ data: normalize(parsed.data) });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique")) {
      return { ok: false, error: "Ya existe un cliente con ese documento." };
    }
    return { ok: false, error: "No se pudo crear el cliente." };
  }
  revalidatePath("/clientes");
  return { ok: true };
}

export async function actualizarCliente(id: string, input: ClienteInput): Promise<ActionResult> {
  await requireSession();
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  try {
    await prisma.cliente.update({ where: { id }, data: normalize(parsed.data) });
  } catch {
    return { ok: false, error: "No se pudo actualizar el cliente." };
  }
  revalidatePath("/clientes");
  return { ok: true };
}

export async function eliminarCliente(id: string): Promise<ActionResult> {
  await requireSession();
  try {
    // Si tiene ventas, se desactiva en lugar de borrar (integridad referencial).
    const ventas = await prisma.venta.count({ where: { clienteId: id } });
    if (ventas > 0) {
      await prisma.cliente.update({ where: { id }, data: { activo: false } });
    } else {
      await prisma.cliente.delete({ where: { id } });
    }
  } catch {
    return { ok: false, error: "No se pudo eliminar el cliente." };
  }
  revalidatePath("/clientes");
  return { ok: true };
}
