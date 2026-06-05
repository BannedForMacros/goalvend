// ============================================================
// Lógica de dominio: Indicadores estratégicos (Módulo 4)
// Fórmula del proyecto: Cumplimiento = (Ventas Reales / Meta) × 100
// ============================================================

import { toNumber } from "@/lib/format";

export type EstadoKpi = "ALTO" | "MODERADO" | "BAJO";

// Umbrales del semáforo de cumplimiento (en %)
export const UMBRAL_ALTO = 90; // 🟢 >= 90%
export const UMBRAL_MODERADO = 60; // 🟡 60% - 89.99%   🔴 < 60%

/**
 * Calcula el % de cumplimiento comercial.
 * @returns porcentaje en base 100 (ej. 87.5)
 */
export function calcularCumplimiento(ventasReales: unknown, metaObjetivo: unknown): number {
  const ventas = toNumber(ventasReales);
  const meta = toNumber(metaObjetivo);
  if (meta <= 0) return 0;
  return (ventas / meta) * 100;
}

/** Determina el estado del semáforo a partir del % de cumplimiento. */
export function estadoCumplimiento(pct: number): EstadoKpi {
  if (pct >= UMBRAL_ALTO) return "ALTO";
  if (pct >= UMBRAL_MODERADO) return "MODERADO";
  return "BAJO";
}

// ----------------------------------------------------------------
// Reglas automatizadas (Sección VI del documento)
// ----------------------------------------------------------------

export interface ReglaAlerta {
  titulo: string;
  mensaje: string;
  nivel: "INFO" | "ADVERTENCIA" | "CRITICO";
  estadoKpi: EstadoKpi;
}

/**
 * Evalúa el cumplimiento de una meta y genera (o no) una alerta comercial,
 * según las reglas: "Si no se alcanza la meta → genera alerta comercial",
 * "Si existe bajo desempeño → genera advertencia estratégica".
 */
export function evaluarRegla(nombreMeta: string, pct: number): ReglaAlerta | null {
  const estado = estadoCumplimiento(pct);
  if (estado === "BAJO") {
    return {
      titulo: "Bajo cumplimiento comercial",
      mensaje: `La meta "${nombreMeta}" está al ${pct.toFixed(1)}%. Se requiere acción estratégica inmediata.`,
      nivel: "CRITICO",
      estadoKpi: "BAJO",
    };
  }
  if (estado === "MODERADO") {
    return {
      titulo: "Rendimiento moderado",
      mensaje: `La meta "${nombreMeta}" está al ${pct.toFixed(1)}%. Aún no se alcanza el objetivo.`,
      nivel: "ADVERTENCIA",
      estadoKpi: "MODERADO",
    };
  }
  return null; // ALTO: no genera alerta
}
