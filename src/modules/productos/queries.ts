import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/format";

export interface ProductoRow {
  id: string;
  nombre: string;
  sku: string;
  descripcion: string;
  precio: number;
  categoria: string;
  activo: boolean;
  ventasCount: number;
}

export async function getProductos(): Promise<ProductoRow[]> {
  const productos = await prisma.producto.findMany({
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { ventas: true } } },
  });
  return productos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    sku: p.sku ?? "",
    descripcion: p.descripcion ?? "",
    precio: toNumber(p.precio),
    categoria: p.categoria ?? "",
    activo: p.activo,
    ventasCount: p._count.ventas,
  }));
}

export async function getProductosResumen() {
  const productos = await prisma.producto.findMany({ where: { activo: true }, select: { precio: true } });
  const total = productos.length;
  const precioPromedio =
    total > 0 ? productos.reduce((s, p) => s + toNumber(p.precio), 0) / total : 0;
  const categorias = await prisma.producto.findMany({
    where: { activo: true, categoria: { not: null } },
    select: { categoria: true },
    distinct: ["categoria"],
  });
  return { total, precioPromedio, categorias: categorias.length };
}
