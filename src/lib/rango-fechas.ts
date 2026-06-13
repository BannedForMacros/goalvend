// Resolución de rangos de fecha (presets + personalizado).
// Fuente única usada por las páginas (server) para filtrar consultas.

export type PresetRango =
  | "hoy"
  | "semana"
  | "mes"
  | "mes-pasado"
  | "trimestre"
  | "anio"
  | "todo"
  | "personalizado";

export interface Rango {
  desde?: Date;
  hasta?: Date;
}

export interface RangoResuelto {
  rango: Rango;
  preset: PresetRango;
  label: string;
  /** YYYY-MM-DD para prellenar inputs de fecha. */
  desdeStr: string;
  hastaStr: string;
}

export const PRESETS_RANGO: { value: PresetRango; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Últimos 7 días" },
  { value: "mes", label: "Este mes" },
  { value: "mes-pasado", label: "Mes pasado" },
  { value: "trimestre", label: "Este trimestre" },
  { value: "anio", label: "Este año" },
  { value: "todo", label: "Todo" },
  { value: "personalizado", label: "Personalizado" },
];

function inicioDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function finDia(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function toStr(d?: Date) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const PRESET_VALIDOS = new Set(PRESETS_RANGO.map((p) => p.value));

export function resolverRango(params: {
  preset?: string;
  desde?: string;
  hasta?: string;
}): RangoResuelto {
  const now = new Date();
  let preset = (params.preset as PresetRango) ?? "mes";
  if (!PRESET_VALIDOS.has(preset)) preset = "mes";

  let desde: Date | undefined;
  let hasta: Date | undefined;
  let label = "Este mes";

  switch (preset) {
    case "hoy":
      desde = inicioDia(now);
      hasta = finDia(now);
      label = "Hoy";
      break;
    case "semana": {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      desde = inicioDia(d);
      hasta = finDia(now);
      label = "Últimos 7 días";
      break;
    }
    case "mes":
      desde = new Date(now.getFullYear(), now.getMonth(), 1);
      hasta = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      label = "Este mes";
      break;
    case "mes-pasado":
      desde = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      hasta = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      label = "Mes pasado";
      break;
    case "trimestre": {
      const q = Math.floor(now.getMonth() / 3);
      desde = new Date(now.getFullYear(), q * 3, 1);
      hasta = new Date(now.getFullYear(), q * 3 + 3, 0, 23, 59, 59, 999);
      label = "Este trimestre";
      break;
    }
    case "anio":
      desde = new Date(now.getFullYear(), 0, 1);
      hasta = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      label = "Este año";
      break;
    case "todo":
      desde = undefined;
      hasta = undefined;
      label = "Todo el historial";
      break;
    case "personalizado": {
      const d = params.desde ? new Date(params.desde + "T00:00:00") : undefined;
      const h = params.hasta ? new Date(params.hasta + "T23:59:59") : undefined;
      desde = d && !isNaN(d.getTime()) ? d : undefined;
      hasta = h && !isNaN(h.getTime()) ? h : undefined;
      if (desde && hasta) label = `${toStr(desde)} a ${toStr(hasta)}`;
      else if (desde) label = `Desde ${toStr(desde)}`;
      else if (hasta) label = `Hasta ${toStr(hasta)}`;
      else label = "Personalizado";
      break;
    }
  }

  return {
    rango: { desde, hasta },
    preset,
    label,
    desdeStr: params.desde ?? toStr(desde),
    hastaStr: params.hasta ?? toStr(hasta),
  };
}

/** Construye la cláusula `where.fecha` de Prisma a partir de un rango. */
export function whereFecha(rango: Rango) {
  if (!rango.desde && !rango.hasta) return {};
  return {
    fecha: {
      ...(rango.desde ? { gte: rango.desde } : {}),
      ...(rango.hasta ? { lte: rango.hasta } : {}),
    },
  };
}
