import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/format";
import { whereFecha, type Rango } from "@/lib/rango-fechas";

export interface VentaRow {
  id: string;
  fecha: string;
  cliente: string;
  clienteDocumento: string;
  producto: string;
  productoCategoria: string;
  vendedor: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export async function getVentas(rango?: Rango, limit = 200): Promise<VentaRow[]> {
  const ventas = await prisma.venta.findMany({
    where: rango ? whereFecha(rango) : {},
    orderBy: { fecha: "desc" },
    take: limit,
    include: {
      cliente: { select: { razonSocial: true, documento: true } },
      producto: { select: { nombre: true, categoria: true } },
      vendedor: { select: { nombre: true } },
    },
  });

  return ventas.map((v) => ({
    id: v.id,
    fecha: v.fecha.toISOString(),
    cliente: v.cliente.razonSocial,
    clienteDocumento: v.cliente.documento,
    producto: v.producto.nombre,
    productoCategoria: v.producto.categoria ?? "",
    vendedor: v.vendedor.nombre,
    cantidad: v.cantidad,
    precioUnitario: toNumber(v.precioUnitario),
    total: toNumber(v.total),
  }));
}

export async function getVentasResumen(rango?: Rango) {
  const where = rango ? whereFecha(rango) : {};
  const [agg, count] = await Promise.all([
    prisma.venta.aggregate({ _sum: { total: true }, where }),
    prisma.venta.count({ where }),
  ]);
  const total = toNumber(agg._sum.total);
  return {
    total,
    operaciones: count,
    ticketPromedio: count > 0 ? total / count : 0,
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
