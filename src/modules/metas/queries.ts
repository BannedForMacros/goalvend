import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/format";
import { calcularCumplimiento, estadoCumplimiento, type EstadoKpi } from "@/lib/kpi";

export interface MetaConCumplimiento {
  id: string;
  nombre: string;
  tipo: "INDIVIDUAL" | "GRUPAL";
  periodo: "MENSUAL" | "TRIMESTRAL";
  montoObjetivo: number;
  anio: number;
  mes: number | null;
  trimestre: number | null;
  fechaInicio: string;
  fechaFin: string;
  vendedorId: string | null;
  vendedorNombre: string | null;
  activa: boolean;
  ventasReales: number;
  pct: number;
  estado: EstadoKpi;
}

export async function getMetasConCumplimiento(): Promise<MetaConCumplimiento[]> {
  const metas = await prisma.meta.findMany({
    orderBy: [{ anio: "desc" }, { creadoEn: "desc" }],
    include: { vendedor: { select: { nombre: true } } },
  });

  const resultado: MetaConCumplimiento[] = [];
  for (const meta of metas) {
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: {
        ...(meta.vendedorId ? { vendedorId: meta.vendedorId } : {}),
        fecha: { gte: meta.fechaInicio, lte: meta.fechaFin },
      },
    });
    const ventasReales = toNumber(agg._sum.total);
    const objetivo = toNumber(meta.montoObjetivo);
    const pct = calcularCumplimiento(ventasReales, objetivo);

    resultado.push({
      id: meta.id,
      nombre: meta.nombre,
      tipo: meta.tipo,
      periodo: meta.periodo,
      montoObjetivo: objetivo,
      anio: meta.anio,
      mes: meta.mes,
      trimestre: meta.trimestre,
      fechaInicio: meta.fechaInicio.toISOString(),
      fechaFin: meta.fechaFin.toISOString(),
      vendedorId: meta.vendedorId,
      vendedorNombre: meta.vendedor?.nombre ?? null,
      activa: meta.activa,
      ventasReales,
      pct,
      estado: estadoCumplimiento(pct),
    });
  }
  return resultado;
}

export async function getMetasResumen(metas: MetaConCumplimiento[]) {
  const total = metas.length;
  const alto = metas.filter((m) => m.estado === "ALTO").length;
  const moderado = metas.filter((m) => m.estado === "MODERADO").length;
  const bajo = metas.filter((m) => m.estado === "BAJO").length;
  const promedio = total > 0 ? metas.reduce((s, m) => s + m.pct, 0) / total : 0;
  return { total, alto, moderado, bajo, promedio };
}

export async function getVendedores() {
  return prisma.usuario.findMany({
    where: { rol: "VENDEDOR", activo: true },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });
}
