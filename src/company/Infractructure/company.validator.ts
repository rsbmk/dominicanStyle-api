import { z } from "zod";

const createComenySchema = z.object({
  name: z.string().min(3, { message: "El nombre debe ser mayor a 3 caracteres" }),
});

const idComanySchema = z.object({
  id: z.number().positive({ message: "El id debe ser un numero positivo" }),
});

export { createComenySchema, idComanySchema };
