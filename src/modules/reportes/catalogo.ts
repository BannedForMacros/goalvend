// Metadatos de reportes (sin imports de servidor → usable en cliente y servidor).

export type ReporteTipo = "ventas" | "metas" | "rendimiento" | "clientes";

export interface ReporteMeta {
  tipo: ReporteTipo;
  nombre: string;
  descripcion: string;
  /** Indica si el reporte se filtra por rango de fechas. */
  usaFecha: boolean;
}

export const REPORTES: ReporteMeta[] = [
  {
    tipo: "ventas",
    nombre: "Ventas por periodo",
    descripcion: "Detalle de operaciones comerciales registradas.",
    usaFecha: true,
  },
  {
    tipo: "metas",
    nombre: "Cumplimiento de metas",
    descripcion: "Indicadores KPI y cumplimiento por meta.",
    usaFecha: false,
  },
  {
    tipo: "rendimiento",
    nombre: "Rendimiento de vendedores",
    descripcion: "Productividad comercial del mes en curso.",
    usaFecha: false,
  },
  {
    tipo: "clientes",
    nombre: "Cartera de clientes",
    descripcion: "Listado de la cartera comercial.",
    usaFecha: false,
  },
];
