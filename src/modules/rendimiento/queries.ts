import { prisma } from "@/lib/prisma";
import { toNumber, nombreMes } from "@/lib/format";
import { calcularCumplimiento, estadoCumplimiento, type EstadoKpi } from "@/lib/kpi";

export interface RendimientoVendedor {
  id: string;
  nombre: string;
  ventasMes: number;
  operaciones: number;
  ticketPromedio: number;
  metaObjetivo: number;
  pct: number;
  estado: EstadoKpi;
}

function rangoMes(offset = 0) {
  const now = new Date();
  return {
    inicio: new Date(now.getFullYear(), now.getMonth() + offset, 1),
    fin: new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999),
  };
}

export async function getRendimientoVendedores(): Promise<RendimientoVendedor[]> {
  const { inicio, fin } = rangoMes(0);
  const vendedores = await prisma.usuario.findMany({
    where: { rol: "VENDEDOR", activo: true },
    select: { id: true, nombre: true },
  });

  const filas: RendimientoVendedor[] = [];
  for (const v of vendedores) {
    const [agg, count, meta] = await Promise.all([
      prisma.venta.aggregate({
        _sum: { total: true },
        where: { vendedorId: v.id, fecha: { gte: inicio, lte: fin } },
      }),
      prisma.venta.count({ where: { vendedorId: v.id, fecha: { gte: inicio, lte: fin } } }),
      prisma.meta.findFirst({
        where: { vendedorId: v.id, periodo: "MENSUAL", activa: true },
        orderBy: { creadoEn: "desc" },
      }),
    ]);
    const ventasMes = toNumber(agg._sum.total);
    const metaObjetivo = toNumber(meta?.montoObjetivo);
    const pct = metaObjetivo > 0 ? calcularCumplimiento(ventasMes, metaObjetivo) : 0;

    filas.push({
      id: v.id,
      nombre: v.nombre,
      ventasMes,
      operaciones: count,
      ticketPromedio: count > 0 ? ventasMes / count : 0,
      metaObjetivo,
      pct,
      estado: estadoCumplimiento(pct),
    });
  }

  return filas.sort((a, b) => b.ventasMes - a.ventasMes);
}

export async function getEvolucionVentas(meses = 6) {
  const serie: { mes: string; ventas: number }[] = [];
  for (let i = meses - 1; i >= 0; i--) {
    const { inicio, fin } = rangoMes(-i);
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: { fecha: { gte: inicio, lte: fin } },
    });
    serie.push({
      mes: nombreMes(inicio.getMonth() + 1).slice(0, 3),
      ventas: Math.round(toNumber(agg._sum.total)),
    });
  }
  return serie;
}
