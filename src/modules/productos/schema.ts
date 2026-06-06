import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(2, "Ingresa el nombre del producto."),
  sku: z.string().optional().or(z.literal("")),
  descripcion: z.string().optional().or(z.literal("")),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0."),
  categoria: z.string().optional().or(z.literal("")),
});

export type ProductoInput = z.infer<typeof productoSchema>;
