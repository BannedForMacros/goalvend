// Etiquetas legibles para los enums del dominio

export const segmentoLabel = {
  CORPORATIVO: "Corporativo",
  PYME: "Pyme",
  MINORISTA: "Minorista",
  EMPRENDEDOR: "Emprendedor",
  NUEVO: "Nuevo",
} as const;

export const nivelActividadLabel = {
  ALTO: "Alto",
  MEDIO: "Medio",
  BAJO: "Bajo",
  INACTIVO: "Inactivo",
} as const;

export const tipoDocumentoLabel = {
  DNI: "DNI",
  RUC: "RUC",
} as const;

export const tipoMetaLabel = {
  INDIVIDUAL: "Individual",
  GRUPAL: "Grupal",
} as const;

export const periodoMetaLabel = {
  MENSUAL: "Mensual",
  TRIMESTRAL: "Trimestral",
} as const;

export const rolLabel = {
  ADMIN: "Administrador",
  GERENTE: "Gerente comercial",
  SUPERVISOR: "Supervisor de ventas",
  VENDEDOR: "Vendedor",
  MARKETING: "Marketing",
} as const;

export const rolOptions = Object.entries(rolLabel).map(([value, label]) => ({ value, label }));
export const segmentoOptions = Object.entries(segmentoLabel).map(([value, label]) => ({ value, label }));
export const nivelActividadOptions = Object.entries(nivelActividadLabel).map(([value, label]) => ({ value, label }));
export const tipoDocumentoOptions = Object.entries(tipoDocumentoLabel).map(([value, label]) => ({ value, label }));
export const tipoMetaOptions = Object.entries(tipoMetaLabel).map(([value, label]) => ({ value, label }));
export const periodoMetaOptions = Object.entries(periodoMetaLabel).map(([value, label]) => ({ value, label }));

export function nivelActividadColor(nivel: keyof typeof nivelActividadLabel): string {
  switch (nivel) {
    case "ALTO":
      return "bg-success/15 text-success border-success/30";
    case "MEDIO":
      return "bg-warning/15 text-warning border-warning/30";
    case "BAJO":
      return "bg-danger/15 text-danger border-danger/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
