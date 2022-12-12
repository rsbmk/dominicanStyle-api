import { PrismaClient, Service } from '@prisma/client'
import { Router } from 'express'

import { validatorHandle } from '../../share/infrastructure/middleware/validator.handle'
import { createServiceSchema, idService } from './services.validator'

export const serviceRoute = Router()
const prisma = new PrismaClient()

// GET / api / v1 / service / team /: team_id - get all services
serviceRoute.get('/team/:team_id',
  validatorHandle(idService, 'params'),
  (request, response, next) => {
    const { team_id: temaId } = request.params

    prisma.service
      .findMany({
        where: { team_id: temaId }
      })
      .then((services) => {
        response.json(services).end()
      })
      .catch(next)
  })

// POST /api/v1/service - create a new service
serviceRoute.post('/',
  validatorHandle(createServiceSchema, 'body'),
  (request, response, next) => {
    const { name, price, team_id: temaId, id }: Service = request.body

    prisma.service
      .create({
        data: {
          id,
          name,
          price,
          team_id: temaId
        }
      })
      .then((service) => {
        response.status(201).json(service).end()
      })
      .catch(next)
  })
