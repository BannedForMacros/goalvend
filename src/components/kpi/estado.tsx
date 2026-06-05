import { CircleCheck, CircleAlert, CircleX, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { estadoCumplimiento, type EstadoKpi } from "@/lib/kpi";

interface EstadoConfig {
  label: string;
  icon: LucideIcon;
  /** Color de marca (token CSS) */
  color: string;
  badgeClass: string;
}

// Configuración visual del semáforo de cumplimiento (iconos de lucide-react)
export const ESTADO_CONFIG: Record<EstadoKpi, EstadoConfig> = {
  ALTO: {
    label: "Alto desempeño",
    icon: CircleCheck,
    color: "var(--brand-green)",
    badgeClass: "bg-success/15 text-success border-success/30",
  },
  MODERADO: {
    label: "Rendimiento moderado",
    icon: CircleAlert,
    color: "var(--brand-orange)",
    badgeClass: "bg-warning/15 text-warning border-warning/30",
  },
  BAJO: {
    label: "Bajo cumplimiento",
    icon: CircleX,
    color: "var(--brand-magenta)",
    badgeClass: "bg-danger/15 text-danger border-danger/30",
  },
};

export function infoEstado(pct: number) {
  const estado = estadoCumplimiento(pct);
  return { estado, pct, ...ESTADO_CONFIG[estado] };
}

/** Nuestro componente de insignia de estado de cumplimiento. */
export function EstadoBadge({
  estado,
  className,
  showLabel = true,
}: {
  estado: EstadoKpi;
  className?: string;
  showLabel?: boolean;
}) {
  const cfg = ESTADO_CONFIG[estado];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.badgeClass,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {showLabel && cfg.label}
    </span>
  );
}

/** Punto/icono de estado para usar en tarjetas resumen del semáforo. */
export function EstadoIcono({ estado, className }: { estado: EstadoKpi; className?: string }) {
  const cfg = ESTADO_CONFIG[estado];
  const Icon = cfg.icon;
  return <Icon className={className} style={{ color: cfg.color }} />;
}
