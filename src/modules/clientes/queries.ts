import { prisma } from "@/lib/prisma";
import type { ClienteRow } from "@/components/clientes/clientes-table";

export async function getClientes(): Promise<ClienteRow[]> {
  const clientes = await prisma.cliente.findMany({
    orderBy: { creadoEn: "desc" },
    include: { _count: { select: { ventas: true } } },
  });

  return clientes.map((c) => ({
    id: c.id,
    razonSocial: c.razonSocial,
    tipoDocumento: c.tipoDocumento,
    documento: c.documento,
    segmento: c.segmento,
    nivelActividad: c.nivelActividad,
    email: c.email ?? "",
    telefono: c.telefono ?? "",
    direccion: c.direccion ?? "",
    activo: c.activo,
    ventasCount: c._count.ventas,
  }));
}

export async function getClientesResumen() {
  const [total, activos, corporativos] = await Promise.all([
    prisma.cliente.count(),
    prisma.cliente.count({ where: { activo: true } }),
    prisma.cliente.count({ where: { segmento: "CORPORATIVO" } }),
  ]);
  return { total, activos, corporativos };
}
