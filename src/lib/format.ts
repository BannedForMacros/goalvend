// Utilidades de formato (Perú / PEN)

const PEN = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NUM = new Intl.NumberFormat("es-PE");

const PCT = new Intl.NumberFormat("es-PE", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Convierte Decimal de Prisma / string / number a número JS seguro. */
export function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const n = Number(value.toString());
  return Number.isFinite(n) ? n : 0;
}

export function formatMoneda(value: unknown): string {
  return PEN.format(toNumber(value));
}

export function formatNumero(value: unknown): string {
  return NUM.format(toNumber(value));
}

/** Recibe un porcentaje en base 100 (ej. 87.5) y lo muestra como "87.5 %". */
export function formatPorcentaje(pct: number): string {
  return PCT.format((pct ?? 0) / 100);
}

export function formatFecha(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatFechaHora(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function nombreMes(mes: number): string {
  return MESES[mes - 1] ?? "";
}
