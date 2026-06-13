import { getVentas } from "@/modules/ventas/queries";
import { getMetasConCumplimiento } from "@/modules/metas/queries";
import { getRendimientoVendedores } from "@/modules/rendimiento/queries";
import { getClientes } from "@/modules/clientes/queries";
import { formatFecha } from "@/lib/format";
import type { Rango } from "@/lib/rango-fechas";
import { ESTADO_CONFIG } from "@/components/kpi/estado";
import { tipoMetaLabel, periodoMetaLabel, segmentoLabel, nivelActividadLabel } from "@/lib/enums";
import { type ReporteTipo } from "./catalogo";

export { REPORTES, type ReporteTipo } from "./catalogo";

export interface ReporteDef {
  titulo: string;
  columnas: { header: string; key: string; width?: number; money?: boolean }[];
  filas: Record<string, string | number>[];
}

export async function buildReporte(tipo: ReporteTipo, rango?: Rango, periodoLabel?: string): Promise<ReporteDef> {
  switch (tipo) {
    case "ventas": {
      const ventas = await getVentas(rango, 5000);
      return {
        titulo: periodoLabel ? `Reporte de Ventas · ${periodoLabel}` : "Reporte de Ventas",
        columnas: [
          { header: "Fecha", key: "fecha", width: 14 },
          { header: "Cliente", key: "cliente", width: 32 },
          { header: "Producto", key: "producto", width: 30 },
          { header: "Vendedor", key: "vendedor", width: 22 },
          { header: "Cantidad", key: "cantidad", width: 10 },
          { header: "Total", key: "total", width: 16, money: true },
        ],
        filas: ventas.map((v) => ({
          fecha: formatFecha(v.fecha),
          cliente: v.cliente,
          producto: v.producto,
          vendedor: v.vendedor,
          cantidad: v.cantidad,
          total: v.total,
        })),
      };
    }
    case "metas": {
      const metas = await getMetasConCumplimiento();
      return {
        titulo: "Reporte de Cumplimiento de Metas",
        columnas: [
          { header: "Meta", key: "nombre", width: 30 },
          { header: "Tipo", key: "tipo", width: 14 },
          { header: "Periodo", key: "periodo", width: 14 },
          { header: "Asignación", key: "asignacion", width: 22 },
          { header: "Objetivo", key: "objetivo", width: 16, money: true },
          { header: "Real", key: "real", width: 16, money: true },
          { header: "Cumplimiento %", key: "pct", width: 16 },
          { header: "Estado", key: "estado", width: 20 },
        ],
        filas: metas.map((m) => ({
          nombre: m.nombre,
          tipo: tipoMetaLabel[m.tipo],
          periodo: periodoMetaLabel[m.periodo],
          asignacion: m.tipo === "INDIVIDUAL" ? m.vendedorNombre ?? "—" : "Grupal",
          objetivo: m.montoObjetivo,
          real: m.ventasReales,
          pct: Number(m.pct.toFixed(1)),
          estado: ESTADO_CONFIG[m.estado].label,
        })),
      };
    }
    case "rendimiento": {
      const vendedores = await getRendimientoVendedores();
      return {
        titulo: "Reporte de Rendimiento de Vendedores",
        columnas: [
          { header: "Vendedor", key: "nombre", width: 24 },
          { header: "Ventas", key: "ventas", width: 16, money: true },
          { header: "Operaciones", key: "operaciones", width: 14 },
          { header: "Ticket promedio", key: "ticket", width: 16, money: true },
          { header: "Cumplimiento %", key: "pct", width: 16 },
          { header: "Estado", key: "estado", width: 20 },
        ],
        filas: vendedores.map((v) => ({
          nombre: v.nombre,
          ventas: v.ventasMes,
          operaciones: v.operaciones,
          ticket: v.ticketPromedio,
          pct: Number(v.pct.toFixed(1)),
          estado: ESTADO_CONFIG[v.estado].label,
        })),
      };
    }
    case "clientes": {
      const clientes = await getClientes();
      return {
        titulo: "Reporte de Cartera de Clientes",
        columnas: [
          { header: "Razón social", key: "razonSocial", width: 34 },
          { header: "Documento", key: "documento", width: 16 },
          { header: "Segmento", key: "segmento", width: 16 },
          { header: "Nivel actividad", key: "nivel", width: 16 },
          { header: "N° Ventas", key: "ventas", width: 12 },
        ],
        filas: clientes.map((c) => ({
          razonSocial: c.razonSocial,
          documento: c.documento,
          segmento: segmentoLabel[c.segmento],
          nivel: nivelActividadLabel[c.nivelActividad],
          ventas: c.ventasCount,
        })),
      };
    }
  }
}
