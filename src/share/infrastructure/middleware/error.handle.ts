import { Prisma } from '@prisma/client'

import { NextFunction, Request, Response } from 'express'
import { isKnownError } from '../../helpers'
import { ERRORS_CODE } from './../../../share/domain/errorshandles'

export const logErrors = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(error.stack)
  next(error)
}

export const clientErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (isKnownError(error.name)) {
    return res.status(404).json({
      message: error.message,
      name: error.name,
      status: 404
    })
  }

  return res.status(500).json({
    message: String(error.message),
    name: String(error.name),
    stack: String(error.stack),
    status: 500
  })
}

export const handlePrismaErros = (error: Error, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code in ERRORS_CODE) {
      const [errorData, status] = ERRORS_CODE[error.code](error) as [any, number]
      return res.status(status).json(errorData).end()
    }

    return res
      .status(424)
      .json({
        errorMessage: error.message,
        errorCode: error.code,
        errorMeta: error.meta,
        errorName: error.name,
        errorStack: error.stack,
        message: 'unknown error PrismaClientKnownRequestError',
        status: 424,
        primaError: error
      })
      .end()
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return res
      .status(424)
      .json({
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        message: 'unknown error of PrismaClientUnknownRequestError',
        status: 424,
        primaError: error
      })
      .end()
  }

  next(error)
}
