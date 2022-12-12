import { Company, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { validatorHandle } from '../../share/infrastructure/middleware/validator.handle'
import { createComenySchema, idComanySchema } from './company.validator'

export const companyRouter = Router()
const prisma = new PrismaClient()

// GET /api/v1/company - get all companies
companyRouter.get('/', (_, response, next) => {
  prisma.company
    .findMany()
    .then((companies) => {
      response.json(companies).end()
    })
    .catch(next)
})

// GET /api/v1/company/:companyId - get a single company
companyRouter.get('/:companyId',
  validatorHandle(idComanySchema, 'params'),
  (request, response, next) => {
    const { companyId } = request.params
    const id = parseInt(companyId)

    prisma.company
      .findFirst({ where: { id } })
      .then((company) => {
        if (company === null) {
          return response
            .status(404)
            .json({
              message: 'Company not found',
              status: 404
            })
            .end()
        }
        response.json(company).end()
      })
      .catch(next)
  })

// POST /api/v1/company - create a new company
companyRouter.post('/',
  validatorHandle(createComenySchema, 'body'),
  (request, response, next) => {
    const { name }: Company = request.body

    prisma.company
      .create({ data: { name } })
      .then((company) => {
        response.json(company).end()
      })
      .catch(next)
  })
