import { z } from "zod";

const idTeamSchema = z.string().uuid();
const createTeamSchema = z.object({
  id: idTeamSchema,
  name: z.string().min(3, { message: "El nombre debe ser mayor a 3 caracteres" }),
})

export { createTeamSchema, idTeamSchema };
