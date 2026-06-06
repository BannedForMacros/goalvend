import { z } from "zod";

export const usuarioSchema = z.object({
  nombre: z.string().min(2, "Ingresa el nombre completo."),
  email: z.string().email("Correo inválido."),
  rol: z.enum(["ADMIN", "GERENTE", "SUPERVISOR", "VENDEDOR", "MARKETING"]),
  telefono: z.string().optional().or(z.literal("")),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .optional()
    .or(z.literal("")),
  activo: z.boolean().optional(),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
