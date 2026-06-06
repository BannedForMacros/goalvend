import { prisma } from "@/lib/prisma";

export interface UsuarioRow {
  id: string;
  nombre: string;
  email: string;
  rol: "ADMIN" | "GERENTE" | "SUPERVISOR" | "VENDEDOR" | "MARKETING";
  telefono: string;
  activo: boolean;
  ventasCount: number;
}

export async function getUsuarios(): Promise<UsuarioRow[]> {
  const usuarios = await prisma.usuario.findMany({
    orderBy: [{ activo: "desc" }, { nombre: "asc" }],
    include: { _count: { select: { ventas: true } } },
  });
  return usuarios.map((u) => ({
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    telefono: u.telefono ?? "",
    activo: u.activo,
    ventasCount: u._count.ventas,
  }));
}

export async function getUsuariosResumen() {
  const [total, activos, vendedores] = await Promise.all([
    prisma.usuario.count(),
    prisma.usuario.count({ where: { activo: true } }),
    prisma.usuario.count({ where: { rol: "VENDEDOR" } }),
  ]);
  return { total, activos, vendedores };
}
