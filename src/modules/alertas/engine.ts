import { prisma } from "@/lib/prisma";
import { calcularCumplimiento, evaluarRegla } from "@/lib/kpi";

/**
 * Reglas automatizadas (Sección VI del documento):
 * recalcula el cumplimiento de las metas del vendedor y sincroniza sus alertas.
 * - Si la meta queda en MODERADO/BAJO → genera/actualiza alerta.
 * - Si la meta alcanza ALTO → limpia alertas pendientes de esa meta.
 */
export async function sincronizarAlertasVendedor(vendedorId: string) {
  const metas = await prisma.meta.findMany({ where: { vendedorId, activa: true } });

  for (const meta of metas) {
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: { vendedorId, fecha: { gte: meta.fechaInicio, lte: meta.fechaFin } },
    });
    const pct = calcularCumplimiento(agg._sum.total, meta.montoObjetivo);
    const regla = evaluarRegla(meta.nombre, pct);

    if (regla) {
      const yaExiste = await prisma.alerta.findFirst({
        where: { metaId: meta.id, leida: false, estadoKpi: regla.estadoKpi },
      });
      if (!yaExiste) {
        // Reemplaza alertas pendientes previas de esta meta (evita duplicados).
        await prisma.alerta.deleteMany({ where: { metaId: meta.id, leida: false } });
        await prisma.alerta.create({
          data: {
            titulo: regla.titulo,
            mensaje: regla.mensaje,
            nivel: regla.nivel,
            estadoKpi: regla.estadoKpi,
            metaId: meta.id,
            vendedorId,
          },
        });
      }
    } else {
      // ALTO: ya no hay riesgo, se descartan alertas pendientes de esta meta.
      await prisma.alerta.deleteMany({ where: { metaId: meta.id, leida: false } });
    }
  }
}
