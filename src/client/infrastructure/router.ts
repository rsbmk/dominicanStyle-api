import { Client, PrismaClient } from '@prisma/client'
import { Router } from 'express'

import { validatorHandle } from '../../share/infrastructure/middleware/validator.handle'
import { cedulaSchema, createClientSchema } from './client.validation'

export const clientRouter = Router()
const prisma = new PrismaClient()

// POST /api/v1/client - create a new client
clientRouter.post('/',
  validatorHandle(createClientSchema, 'body'),
  (request, response, next) => {
    const { cedula, last_name: lastName, name, telephone = null }: Client = request.body

    prisma.client
      .create({
        data: {
          cedula,
          last_name: lastName,
          name,
          telephone
        }
      })
      .then((client) => {
        response
          .status(201)
          .json({
            client,
            message: 'Cliente creado con exito',
            status: 201
          })
          .end()
      })
      .catch(next)
  })

// GET /api/v1/client/:cedula - Get client by id
clientRouter.get('/:cedula',
  validatorHandle(cedulaSchema, 'params'),
  (request, response, next) => {
    const { cedula } = request.params

    prisma.client
      .findUnique({
        where: { cedula }
      })
      .then((client) => {
        if (client == null) {
          return response
            .status(404)
            .json({
              message: 'El cliente no existe o ingreso una cedula incorrecta',
              status: 400,
              error: 'No se encontro el cliente',
              fields: ['cedula'],
              nameInput: 'cedula'
            })
            .end()
        }
        response.json(client).end()
      })
      .catch(next)
  })
