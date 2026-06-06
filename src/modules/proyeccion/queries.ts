import { prisma } from "@/lib/prisma";
import { toNumber, nombreMes } from "@/lib/format";
import { calcularCumplimiento, estadoCumplimiento, type EstadoKpi } from "@/lib/kpi";

export interface ProyeccionVendedor {
  id: string;
  nombre: string;
  ventasActual: number;
  proyeccion: number;
  metaObjetivo: number;
  pctProyectado: number;
  estado: EstadoKpi;
  enRiesgo: boolean;
}

export interface ProyeccionData {
  diaActual: number;
  diasMes: number;
  factor: number;
  ventasMesActual: number;
  proyeccionFinMes: number;
  metaGrupal: number;
  pctProyectado: number;
  estadoProyectado: EstadoKpi;
  serie: { mes: string; ventas: number; proyeccion?: number }[];
  vendedores: ProyeccionVendedor[];
}

function rangoMes(offset = 0) {
  const now = new Date();
  return {
    inicio: new Date(now.getFullYear(), now.getMonth() + offset, 1),
    fin: new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999),
  };
}

export async function getProyeccion(): Promise<ProyeccionData> {
  const now = new Date();
  const diaActual = now.getDate();
  const diasMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const factor = diaActual > 0 ? diasMes / diaActual : 1;
  const { inicio, fin } = rangoMes(0);

  const [aggMes, metaGrupalRow, vendedoresRaw] = await Promise.all([
    prisma.venta.aggregate({ _sum: { total: true }, where: { fecha: { gte: inicio, lte: fin } } }),
    prisma.meta.findFirst({
      where: { tipo: "GRUPAL", periodo: "MENSUAL", activa: true },
      orderBy: { creadoEn: "desc" },
    }),
    prisma.usuario.findMany({
      where: { rol: "VENDEDOR", activo: true },
      select: { id: true, nombre: true },
    }),
  ]);

  const ventasMesActual = toNumber(aggMes._sum.total);
  const proyeccionFinMes = ventasMesActual * factor;
  const metaGrupal = toNumber(metaGrupalRow?.montoObjetivo);
  const pctProyectado = metaGrupal > 0 ? calcularCumplimiento(proyeccionFinMes, metaGrupal) : 0;

  // Serie histórica (5 meses) + proyección del mes actual
  const serie: { mes: string; ventas: number; proyeccion?: number }[] = [];
  for (let i = 5; i >= 1; i--) {
    const r = rangoMes(-i);
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: { fecha: { gte: r.inicio, lte: r.fin } },
    });
    serie.push({
      mes: nombreMes(r.inicio.getMonth() + 1).slice(0, 3),
      ventas: Math.round(toNumber(agg._sum.total)),
    });
  }
  serie.push({
    mes: nombreMes(now.getMonth() + 1).slice(0, 3),
    ventas: Math.round(ventasMesActual),
    proyeccion: Math.round(proyeccionFinMes),
  });

  // Proyección por vendedor
  const vendedores: ProyeccionVendedor[] = [];
  for (const v of vendedoresRaw) {
    const [agg, meta] = await Promise.all([
      prisma.venta.aggregate({
        _sum: { total: true },
        where: { vendedorId: v.id, fecha: { gte: inicio, lte: fin } },
      }),
      prisma.meta.findFirst({
        where: { vendedorId: v.id, periodo: "MENSUAL", activa: true },
        orderBy: { creadoEn: "desc" },
      }),
    ]);
    const ventasActual = toNumber(agg._sum.total);
    const proyeccion = ventasActual * factor;
    const metaObjetivo = toNumber(meta?.montoObjetivo);
    const pctProy = metaObjetivo > 0 ? calcularCumplimiento(proyeccion, metaObjetivo) : 0;
    const estado = estadoCumplimiento(pctProy);
    vendedores.push({
      id: v.id,
      nombre: v.nombre,
      ventasActual,
      proyeccion,
      metaObjetivo,
      pctProyectado: pctProy,
      estado,
      enRiesgo: estado !== "ALTO",
    });
  }

  return {
    diaActual,
    diasMes,
    factor,
    ventasMesActual,
    proyeccionFinMes,
    metaGrupal,
    pctProyectado,
    estadoProyectado: estadoCumplimiento(pctProyectado),
    serie,
    vendedores: vendedores.sort((a, b) => a.pctProyectado - b.pctProyectado),
  };
}
