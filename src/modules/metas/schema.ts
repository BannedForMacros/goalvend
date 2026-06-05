import { z } from "zod";

export const metaSchema = z
  .object({
    nombre: z.string().min(2, "Ingresa un nombre para la meta."),
    tipo: z.enum(["INDIVIDUAL", "GRUPAL"]),
    periodo: z.enum(["MENSUAL", "TRIMESTRAL"]),
    vendedorId: z.string().optional().or(z.literal("")),
    montoObjetivo: z.coerce.number().positive("El objetivo debe ser mayor a 0."),
    anio: z.coerce.number().int().min(2020).max(2100),
    mes: z.coerce.number().int().min(1).max(12).optional(),
    trimestre: z.coerce.number().int().min(1).max(4).optional(),
  })
  .refine((d) => d.tipo !== "INDIVIDUAL" || !!d.vendedorId, {
    message: "Selecciona un vendedor para la meta individual.",
    path: ["vendedorId"],
  })
  .refine((d) => d.periodo !== "MENSUAL" || !!d.mes, {
    message: "Selecciona el mes.",
    path: ["mes"],
  })
  .refine((d) => d.periodo !== "TRIMESTRAL" || !!d.trimestre, {
    message: "Selecciona el trimestre.",
    path: ["trimestre"],
  });

export type MetaInput = z.infer<typeof metaSchema>;
