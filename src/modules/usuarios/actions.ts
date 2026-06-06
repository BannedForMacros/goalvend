"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { usuarioSchema, type UsuarioInput } from "./schema";

export type ActionResult = { ok: boolean; error?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "GERENTE"].includes(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session;
}

export async function crearUsuario(input: UsuarioInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = usuarioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const d = parsed.data;
  if (!d.password) return { ok: false, error: "La contraseña es obligatoria." };

  try {
    await prisma.usuario.create({
      data: {
        nombre: d.nombre.trim(),
        email: d.email.trim().toLowerCase(),
        rol: d.rol,
        telefono: d.telefono?.trim() || null,
        passwordHash: await bcrypt.hash(d.password, 10),
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique"))
      return { ok: false, error: "Ya existe un usuario con ese correo." };
    return { ok: false, error: "No se pudo crear el usuario." };
  }
  revalidatePath("/usuarios");
  return { ok: true };
}

export async function actualizarUsuario(id: string, input: UsuarioInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = usuarioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const d = parsed.data;

  try {
    await prisma.usuario.update({
      where: { id },
      data: {
        nombre: d.nombre.trim(),
        email: d.email.trim().toLowerCase(),
        rol: d.rol,
        telefono: d.telefono?.trim() || null,
        ...(d.password ? { passwordHash: await bcrypt.hash(d.password, 10) } : {}),
      },
    });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique"))
      return { ok: false, error: "Ya existe un usuario con ese correo." };
    return { ok: false, error: "No se pudo actualizar el usuario." };
  }
  revalidatePath("/usuarios");
  return { ok: true };
}

export async function toggleUsuarioActivo(id: string, activo: boolean): Promise<ActionResult> {
  const session = await requireAdmin();
  if (session.user.id === id) {
    return { ok: false, error: "No puedes desactivar tu propia cuenta." };
  }
  try {
    await prisma.usuario.update({ where: { id }, data: { activo } });
  } catch {
    return { ok: false, error: "No se pudo actualizar el estado." };
  }
  revalidatePath("/usuarios");
  return { ok: true };
}
