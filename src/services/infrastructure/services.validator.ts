import { z } from "zod";
import { idTeamSchema } from "../../team/infrastructure/team.validation";

const idService = z.string().uuid();
const createServiceSchema = z.object({
  id: idService,
  name: z.string().min(3, { message: "El nombre debe ser mayor a 3 caracteres" }),
  price: z.number().positive({ message: "El precio debe ser mayor a 0" }),
  team_id: idTeamSchema
});

export { createServiceSchema, idService };
