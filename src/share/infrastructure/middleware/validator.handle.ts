import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodSchema } from 'zod'

/**
 * It takes a schema and a property (body, params, or query) and returns a middleware function that
 * validates the data in the request object
 * @param {ZodSchema} schema - The schema that we want to validate against.
 * @param {'body' | 'params' | 'query'} property - 'body' | 'params' | 'query'
 * @returns A function that takes in a request, response, and next function.
 */
export const validatorHandle = (schema: ZodSchema, property: 'body' | 'params' | 'query') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property]
    const { success, error } = schema.safeParse(data) as { success: boolean, error: ZodError }

    if (success) return next()

    next(error)
  }
}
