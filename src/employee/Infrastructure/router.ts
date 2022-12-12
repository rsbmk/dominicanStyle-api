import { Employee, PrismaClient } from '@prisma/client'
import { Router } from 'express'

import { validatorHandle } from '../../share/infrastructure/middleware/validator.handle'
import { createEmployeeSchema, idEmployeeSchema } from './employee.validator'

export const employeeRouter = Router()
const prisma = new PrismaClient()

// GET /api/v1/employee - get all employee
employeeRouter.get('/', (_, response, next) => {
  prisma.employee
    .findMany({
      include: {
        Employee_Team: {
          include: {
            Team: {
              include: {
                Service: true
              }
            }
          }
        }
      }
    })
    .then((employee) => response.json(employee).end())
    .catch(next)
})

// GET /api/v1/employee/:employeeId - get a single employee
employeeRouter.get('/:employeeId',
  validatorHandle(idEmployeeSchema, 'params'),
  (request, response, next) => {
    const { employeeId } = request.params

    prisma.employee
      .findUnique({
        where: { id: employeeId },
        include: {
          Appointment: true,
          Employee_Team: {
            include: {
              Team: {
                include: {
                  Service: true
                }
              }
            }
          }
        }
      })
      .then((employee) => response.json(employee).end())
      .catch(next)
  })

// get /api/v1/employee/:employeeId/team/:teamId/services - employee with services
employeeRouter.get('/:employeeId/services',
  validatorHandle(idEmployeeSchema, 'params'),
  (request, response, next) => {
    const { employeeId } = request.params

    prisma.employee_Team
      .findMany({
        where: { employee_id: employeeId },
        include: {
          Team: {
            include: {
              Service: true
            }
          }
        }
      })
      .then((employee) => response.json(employee).end())
      .catch(next)
  })

// POST /api/v1/employee - create a new employee
interface EmployeeBody {
  teamsIds: string[]
  employee: Employee
}
employeeRouter.post('/',
  validatorHandle(createEmployeeSchema, 'body'),
  (request, response, next) => {
    const { teamsIds, employee }: EmployeeBody = request.body
    const { name, last_name: lastName, company_id: companyId, address = null, telephone = null, id }: Employee = employee

    prisma.employee
      .create({
        data: {
          id,
          name,
          address,
          telephone,
          last_name: lastName,
          company_id: companyId,
          Employee_Team: {
            create: teamsIds.map((teamId) => ({ team_id: teamId }))
          }
        }
      })
      .then((employee) => {
        response.status(201).json(employee).end()
      })
      .catch(next)
  })

// PUT / api / v1 / employee /: employeeId - update employee
employeeRouter.put('/:employeeId',
  validatorHandle(idEmployeeSchema, 'params'),
  validatorHandle(createEmployeeSchema, 'body'),
  (request, response, next) => {
    const { employeeId } = request.params
    const { name, telephone, address, last_name: lastName, company_id: companyId }: Employee = request.body

    prisma.employee
      .update({
        where: { id: employeeId },
        data: {
          name,
          address,
          telephone,
          last_name: lastName,
          company_id: companyId
        }
      })
      .then((employee) => {
        response.status(200).json(employee).end()
      })
      .catch(next)
  })
