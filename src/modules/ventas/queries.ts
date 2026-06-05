import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/format";

export interface VentaRow {
  id: string;
  fecha: string;
  cliente: string;
  producto: string;
  vendedor: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

function rangoMesActual() {
  const now = new Date();
  return {
    inicio: new Date(now.getFullYear(), now.getMonth(), 1),
    fin: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

export async function getVentas(limit = 100): Promise<VentaRow[]> {
  const ventas = await prisma.venta.findMany({
    orderBy: { fecha: "desc" },
    take: limit,
    include: {
      cliente: { select: { razonSocial: true } },
      producto: { select: { nombre: true } },
      vendedor: { select: { nombre: true } },
    },
  });

  return ventas.map((v) => ({
    id: v.id,
    fecha: v.fecha.toISOString(),
    cliente: v.cliente.razonSocial,
    producto: v.producto.nombre,
    vendedor: v.vendedor.nombre,
    cantidad: v.cantidad,
    precioUnitario: toNumber(v.precioUnitario),
    total: toNumber(v.total),
  }));
}

export async function getVentasResumen() {
  const { inicio, fin } = rangoMesActual();
  const [aggMes, countMes, countTotal] = await Promise.all([
    prisma.venta.aggregate({ _sum: { total: true }, where: { fecha: { gte: inicio, lte: fin } } }),
    prisma.venta.count({ where: { fecha: { gte: inicio, lte: fin } } }),
    prisma.venta.count(),
  ]);
  const totalMes = toNumber(aggMes._sum.total);
  return {
    totalMes,
    operacionesMes: countMes,
    ticketPromedio: countMes > 0 ? totalMes / countMes : 0,
    operacionesTotal: countTotal,
  };
}

/** Catálogos para el formulario de registro de ventas. */
export async function getOpcionesVenta() {
  const [clientes, productos, vendedores] = await Promise.all([
    prisma.cliente.findMany({
      where: { activo: true },
      orderBy: { razonSocial: "asc" },
      select: { id: true, razonSocial: true },
    }),
    prisma.producto.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, precio: true },
    }),
    prisma.usuario.findMany({
      where: { rol: "VENDEDOR", activo: true },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true },
    }),
  ]);

  return {
    clientes,
    productos: productos.map((p) => ({ id: p.id, nombre: p.nombre, precio: toNumber(p.precio) })),
    vendedores,
  };
}
