import { prisma } from "@/lib/prisma";
import { toNumber, nombreMes } from "@/lib/format";
import { calcularCumplimiento, estadoCumplimiento, type EstadoKpi } from "@/lib/kpi";

function rangoMes(offset = 0) {
  const now = new Date();
  const inicio = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const fin = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999);
  return { inicio, fin };
}

export interface DashboardData {
  ventasMes: number;
  ventasMesAnterior: number;
  variacion: number;
  totalClientes: number;
  operacionesMes: number;
  ticketPromedio: number;
  cumplimientoGlobal: number;
  estadoGlobal: EstadoKpi;
  metaGlobal: number;
  serieMensual: { mes: string; ventas: number }[];
  ranking: { nombre: string; total: number }[];
  porSegmento: { segmento: string; total: number }[];
  semaforo: { alto: number; moderado: number; bajo: number };
}

export async function getDashboardData(): Promise<DashboardData> {
  const { inicio: iMes, fin: fMes } = rangoMes(0);
  const { inicio: iPrev, fin: fPrev } = rangoMes(-1);

  const [aggMes, aggPrev, totalClientes, opsMes, metaGrupal] = await Promise.all([
    prisma.venta.aggregate({ _sum: { total: true }, where: { fecha: { gte: iMes, lte: fMes } } }),
    prisma.venta.aggregate({ _sum: { total: true }, where: { fecha: { gte: iPrev, lte: fPrev } } }),
    prisma.cliente.count({ where: { activo: true } }),
    prisma.venta.count({ where: { fecha: { gte: iMes, lte: fMes } } }),
    prisma.meta.findFirst({
      where: { tipo: "GRUPAL", periodo: "MENSUAL", activa: true },
      orderBy: { creadoEn: "desc" },
    }),
  ]);

  const ventasMes = toNumber(aggMes._sum.total);
  const ventasMesAnterior = toNumber(aggPrev._sum.total);
  const variacion =
    ventasMesAnterior > 0 ? ((ventasMes - ventasMesAnterior) / ventasMesAnterior) * 100 : 0;
  const ticketPromedio = opsMes > 0 ? ventasMes / opsMes : 0;

  const metaGlobal = toNumber(metaGrupal?.montoObjetivo);
  const cumplimientoGlobal = calcularCumplimiento(ventasMes, metaGlobal || ventasMes);
  const estadoGlobal = estadoCumplimiento(cumplimientoGlobal);

  // Serie de los últimos 6 meses
  const serieMensual: { mes: string; ventas: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const { inicio, fin } = rangoMes(-i);
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: { fecha: { gte: inicio, lte: fin } },
    });
    serieMensual.push({
      mes: nombreMes(inicio.getMonth() + 1).slice(0, 3),
      ventas: Math.round(toNumber(agg._sum.total)),
    });
  }

  // Ranking de vendedores (mes actual)
  const ventasPorVendedor = await prisma.venta.groupBy({
    by: ["vendedorId"],
    _sum: { total: true },
    where: { fecha: { gte: iMes, lte: fMes } },
    orderBy: { _sum: { total: "desc" } },
    take: 5,
  });
  const vendedores = await prisma.usuario.findMany({
    where: { id: { in: ventasPorVendedor.map((v) => v.vendedorId) } },
    select: { id: true, nombre: true },
  });
  const ranking = ventasPorVendedor.map((v) => ({
    nombre: vendedores.find((u) => u.id === v.vendedorId)?.nombre ?? "—",
    total: Math.round(toNumber(v._sum.total)),
  }));

  // Ventas por segmento (mes actual)
  const ventasSegmento = await prisma.venta.findMany({
    where: { fecha: { gte: iMes, lte: fMes } },
    select: { total: true, cliente: { select: { segmento: true } } },
  });
  const segMap = new Map<string, number>();
  for (const v of ventasSegmento) {
    const s = v.cliente.segmento;
    segMap.set(s, (segMap.get(s) ?? 0) + toNumber(v.total));
  }
  const porSegmento = Array.from(segMap.entries()).map(([segmento, total]) => ({
    segmento,
    total: Math.round(total),
  }));

  // Semáforo: estado de cumplimiento de metas individuales del mes
  const metasIndividuales = await prisma.meta.findMany({
    where: { tipo: "INDIVIDUAL", periodo: "MENSUAL", activa: true },
  });
  const semaforo = { alto: 0, moderado: 0, bajo: 0 };
  for (const meta of metasIndividuales) {
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: {
        vendedorId: meta.vendedorId ?? undefined,
        fecha: { gte: meta.fechaInicio, lte: meta.fechaFin },
      },
    });
    const pct = calcularCumplimiento(agg._sum.total, meta.montoObjetivo);
    const estado = estadoCumplimiento(pct);
    if (estado === "ALTO") semaforo.alto++;
    else if (estado === "MODERADO") semaforo.moderado++;
    else semaforo.bajo++;
  }

  return {
    ventasMes,
    ventasMesAnterior,
    variacion,
    totalClientes,
    operacionesMes: opsMes,
    ticketPromedio,
    cumplimientoGlobal,
    estadoGlobal,
    metaGlobal,
    serieMensual,
    ranking,
    porSegmento,
    semaforo,
  };
}
