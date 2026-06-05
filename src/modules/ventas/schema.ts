import { z } from "zod";

export const ventaSchema = z.object({
  clienteId: z.string().min(1, "Selecciona un cliente."),
  productoId: z.string().min(1, "Selecciona un producto."),
  vendedorId: z.string().min(1, "Selecciona un vendedor."),
  cantidad: z.coerce.number().int().min(1, "La cantidad debe ser al menos 1."),
  fecha: z.string().optional(),
});

export type VentaInput = z.infer<typeof ventaSchema>;
