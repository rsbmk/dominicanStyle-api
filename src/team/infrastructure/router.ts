import { PrismaClient, Team } from '@prisma/client'
import { Router } from 'express'

import { validatorHandle } from '../../share/infrastructure/middleware/validator.handle'
import { createTeamSchema, idTeamSchema } from './team.validation'

export const teamRoute = Router()
const prisma = new PrismaClient()

// GET /api/v1/team - get all teams
teamRoute.get('/', (_, response, next) => {
  prisma.team
    .findMany()
    .then((teams) => {
      response.json(teams).end()
    })
    .catch(next)
})

// GET /api/v1/team/:teamId - get a single team
teamRoute.get('/:teamId',
  validatorHandle(idTeamSchema, 'params'),
  (request, response, next) => {
    const { teamId } = request.params

    prisma.team
      .findFirst({ where: { id: teamId } })
      .then((team) => {
        if (team === null) {
          return response
            .status(404)
            .json({
              message: 'Role not found',
              status: 404
            })
            .end()
        }
        response.json(team).end()
      })
      .catch(next)
  })

// POST /api/v1/team/ - create a new team
teamRoute.post('/',
  validatorHandle(createTeamSchema, 'body'),
  (request, response, next) => {
    const { name, id }: Team = request.body

    prisma.team
      .create({
        data: {
          id,
          name
        }
      })
      .then((team) => {
        response.status(201).json(team).end()
      })
      .catch(next)
  })
