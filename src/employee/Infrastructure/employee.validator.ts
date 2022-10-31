import { z } from "zod";
import { idComanySchema } from "../../company/Infractructure/company.validator";
import { idTeamSchema } from "../../team/infrastructure/team.validation";

const idEmployeeSchema = z.string().uuid();

const employeeShema = z.object({
  id: idEmployeeSchema,
  name: z.string().min(3, { message: "El nombre debe ser mayor a 3 caracteres" }),
  last_name: z.string().min(3, { message: "El apellido debe ser mayor a 3 caracteres" }),
  telephone: z.string().length(10, { message: "El telefono debe tener 10 digitos" }).optional(),
  address: z.string().min(3, { message: "La direccion debe ser mayor a 3 caracteres" }).optional(),
  company_id: idComanySchema
});

const createEmployeeSchema = z.object({
  employee: employeeShema,
  teamsIds: z.array(idTeamSchema)
})

export { idEmployeeSchema, createEmployeeSchema };
