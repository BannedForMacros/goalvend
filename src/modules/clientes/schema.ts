import { z } from "zod";

export const clienteSchema = z.object({
  razonSocial: z.string().min(2, "Ingresa el nombre o razón social."),
  tipoDocumento: z.enum(["DNI", "RUC"]),
  documento: z
    .string()
    .min(8, "Documento inválido.")
    .max(11, "Documento inválido.")
    .regex(/^\d+$/, "Solo números."),
  segmento: z.enum(["CORPORATIVO", "PYME", "MINORISTA", "EMPRENDEDOR", "NUEVO"]),
  nivelActividad: z.enum(["ALTO", "MEDIO", "BAJO", "INACTIVO"]),
  email: z.string().email("Correo inválido.").optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
