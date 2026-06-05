import { prisma } from "@/lib/prisma";

export interface AlertaRow {
  id: string;
  titulo: string;
  mensaje: string;
  nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
  estadoKpi: "ALTO" | "MODERADO" | "BAJO" | null;
  leida: boolean;
  vendedor: string | null;
  meta: string | null;
  creadoEn: string;
}

export async function getAlertas(): Promise<AlertaRow[]> {
  const alertas = await prisma.alerta.findMany({
    orderBy: [{ leida: "asc" }, { creadoEn: "desc" }],
    include: {
      vendedor: { select: { nombre: true } },
      meta: { select: { nombre: true } },
    },
  });

  return alertas.map((a) => ({
    id: a.id,
    titulo: a.titulo,
    mensaje: a.mensaje,
    nivel: a.nivel,
    estadoKpi: a.estadoKpi,
    leida: a.leida,
    vendedor: a.vendedor?.nombre ?? null,
    meta: a.meta?.nombre ?? null,
    creadoEn: a.creadoEn.toISOString(),
  }));
}

export async function getAlertasResumen() {
  const [total, noLeidas, criticas] = await Promise.all([
    prisma.alerta.count(),
    prisma.alerta.count({ where: { leida: false } }),
    prisma.alerta.count({ where: { nivel: "CRITICO", leida: false } }),
  ]);
  return { total, noLeidas, criticas };
}
