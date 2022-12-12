import { Appointment, Appointment_state, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import { Router } from 'express'

import { APPOINTMENT_STATUS } from './../../constants.local'
import { validatorHandle } from './../../share/infrastructure/middleware/validator.handle'
import { createAppointmen, findAppointmentByClient, findAppointmentByEmploye } from './appointment.validaton'

const prisma = new PrismaClient()
export const appointmentRouter = Router()

// GET /api/v1/appointment/:employeeId/employee - Get appointment by employee id
appointmentRouter.get('/:employee_id/employee',
  validatorHandle(findAppointmentByEmploye, 'params'),
  (request, response, next) => {
    const { employee_id: employeeId } = request.params

    prisma.appointment
      .findMany({
        where: { employee_id: employeeId },
        include: {
          Client: true,
          Service_Appointment: {
            include: {
              Service: true
            }
          }
        }
      })
      .then((appointments) => {
        response.json(appointments).end()
      })
      .catch(next)
  })

// GET /api/v1/appointment/:client_id/client - Get appointment by client id
appointmentRouter.get('/:client_id/client',
  validatorHandle(findAppointmentByClient, 'params'),
  (request, response, next) => {
    const { client_id: clientId } = request.params

    prisma.appointment
      .findMany({
        where: { client_id: clientId },
        include: {
          Employee: true,
          Service_Appointment: {
            include: {
              Service: true
            }
          }
        }
      })
      .then((appointments) => {
        response.json(appointments).end()
      })
      .catch(next)
  })

// POST /api/v1/appointment - create appointment
interface CreateAppointmentBody {
  appointment: Appointment
  serviceIds: string[]
}

appointmentRouter.post('/',
  validatorHandle(createAppointmen, 'body'),
  (request, response, next) => {
    const { appointment, serviceIds }: CreateAppointmentBody = request.body
    const { appointmentDate, client_id: clientId, employee_id: employeeId, id } = appointment

    // crear la cita
    prisma.appointment
      .create({
        data: {
          id,
          appointmentDate: dayjs(appointmentDate).toJSON(),
          state: APPOINTMENT_STATUS.PENDING as Appointment_state,
          client_id: clientId,
          employee_id: employeeId,
          Service_Appointment: {
            create: serviceIds.map((serviceId) => ({
              service_id: serviceId
            }))
          }
        },
        include: {
          Client: true,
          Employee: true,
          Service_Appointment: { include: { Service: true } }
        }
      })
      .then((appointment) => response.status(201).json(appointment).end())
      .catch(next)
  }
)
