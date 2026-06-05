"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: boolean; error?: string };

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

export async function marcarLeida(id: string): Promise<ActionResult> {
  await requireSession();
  try {
    await prisma.alerta.update({ where: { id }, data: { leida: true } });
  } catch {
    return { ok: false, error: "No se pudo actualizar la alerta." };
  }
  revalidatePath("/alertas");
  return { ok: true };
}

export async function marcarTodasLeidas(): Promise<ActionResult> {
  await requireSession();
  await prisma.alerta.updateMany({ where: { leida: false }, data: { leida: true } });
  revalidatePath("/alertas");
  return { ok: true };
}

export async function eliminarAlerta(id: string): Promise<ActionResult> {
  await requireSession();
  try {
    await prisma.alerta.delete({ where: { id } });
  } catch {
    return { ok: false, error: "No se pudo eliminar la alerta." };
  }
  revalidatePath("/alertas");
  return { ok: true };
}
