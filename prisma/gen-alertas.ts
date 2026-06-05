import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const UMBRAL_ALTO = 90;
const UMBRAL_MODERADO = 60;

function pctOf(real: number, meta: number) {
  return meta > 0 ? (real / meta) * 100 : 0;
}

async function main() {
  await prisma.alerta.deleteMany();
  const metas = await prisma.meta.findMany({ where: { vendedorId: { not: null }, activa: true } });
  let creadas = 0;

  for (const meta of metas) {
    const agg = await prisma.venta.aggregate({
      _sum: { total: true },
      where: { vendedorId: meta.vendedorId!, fecha: { gte: meta.fechaInicio, lte: meta.fechaFin } },
    });
    const real = Number(agg._sum.total ?? 0);
    const pct = pctOf(real, Number(meta.montoObjetivo));

    if (pct < UMBRAL_MODERADO) {
      await prisma.alerta.create({
        data: {
          titulo: "Bajo cumplimiento comercial",
          mensaje: `La meta "${meta.nombre}" está al ${pct.toFixed(1)}%. Se requiere acción estratégica inmediata.`,
          nivel: "CRITICO",
          estadoKpi: "BAJO",
          metaId: meta.id,
          vendedorId: meta.vendedorId,
        },
      });
      creadas++;
    } else if (pct < UMBRAL_ALTO) {
      await prisma.alerta.create({
        data: {
          titulo: "Rendimiento moderado",
          mensaje: `La meta "${meta.nombre}" está al ${pct.toFixed(1)}%. Aún no se alcanza el objetivo.`,
          nivel: "ADVERTENCIA",
          estadoKpi: "MODERADO",
          metaId: meta.id,
          vendedorId: meta.vendedorId,
        },
      });
      creadas++;
    }
  }

  console.log(`Alertas generadas: ${creadas}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
