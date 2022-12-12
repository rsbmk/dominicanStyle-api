import dayjs from 'dayjs'
import { z } from 'zod'

const employeeId = z.string().uuid()
const clientId = z.string().regex(/[0-9]{10}/g)

const appointment = z.object({
  id: z.string().uuid(),
  appointmentDate: z.date().min(dayjs().add(3, 'hour').toDate(), { message: 'La cita debe ser al menos 3 horas después de la hora actual' }),
  // state: z.enum(['pending', 'confirmed', 'canceled', 'process', 'close', 'cancelled'], { invalid_type_error: 'El estado de la cita no es válido' }),
  client_id: clientId,
  employee_id: employeeId
}).required()

const serviceIds = z.array(z.string().uuid()).nonempty()

const createAppointmen = z.object({
  appointment,
  serviceIds
}).required()

const findAppointmentByEmploye = z.object({ employee_id: employeeId })
const findAppointmentByClient = z.object({ client_id: clientId })

export { createAppointmen, appointment, findAppointmentByEmploye, findAppointmentByClient }
