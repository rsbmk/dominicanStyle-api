import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ERRORS_CODE } from "./../../../share/domain/errorshandles";

export function logErrors(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error.stack);
  next(error);
}

export function clientErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error.name === "ZodError") {
    res.status(400).json({
      error,
      status: 400,
      message: "Bad Request - ZodError",
    })
  }

  res.status(500).json({
    errorMessage: String(error.message),
    status: 500,
    errorStack: String(error.stack),
    error
  });
}

export const handlePrismaErros = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code in ERRORS_CODE) {
      const [errorData, status] = ERRORS_CODE[error.code](error) as [any, number];
      res.status(status).json(errorData).end();
    }

    res
      .status(424)
      .json({
        errorMessage: error.message,
        errorCode: error.code,
        errorMeta: error.meta,
        errorName: error.name,
        errorStack: error.stack,
        message: "unknown error PrismaClientKnownRequestError",
        status: 424,
        primaError: error,
      })
      .end();
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    res
      .status(424)
      .json({
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        message: "unknown error of PrismaClientUnknownRequestError",
        status: 424,
        primaError: error,
      })
      .end();
  }

  next(error);
};

