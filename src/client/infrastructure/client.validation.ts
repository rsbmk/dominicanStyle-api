import { z } from 'zod'

const cedulaSchema = z.string({ required_error: "La cedula es un campo requerido" }).regex(/^[0-9]{10}$/, { message: 'La cedula debe tener 10 digitos' })

const createClientSchema = z.object({
  cedula: cedulaSchema,
  last_name: z.string({ required_error: "El apellido es un campo requerido" }),
  name: z.string({ required_error: "El nombre es un campo requerido" }),
  telephone: z.string().regex(/^[0-9]{10}$/).optional()
})

export { createClientSchema, cedulaSchema }
