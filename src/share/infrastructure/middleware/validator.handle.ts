import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validatorHandle(schema: any, property: 'body' | 'params' | 'query') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property]
    const { success, error } = schema.safeParse(data)

    if (success) next()

    next(error)
  }
}