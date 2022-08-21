import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

export const errorRouter = (request: Request, response: Response) => {
  response
    .status(404)
    .json({
      message: `Not found ${request.url}`,
      status: 404,
    })
    .end();
};

type errorType = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError;
type errorsCodeType = {
  [key: string]: Function;
};

const ERRORS_CODE: errorsCodeType = {
  P2002: (error: errorType) => [
    {
      message: "data already exists",
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      status: 409,
      error,
    },
    409,
  ],
};

export const handleCatch = (error: any, response: Response) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code in ERRORS_CODE) {
      const [errorData, status] = ERRORS_CODE[error.code](error) as [any, number];
      return response.status(status).json(errorData).end();
    }

    return response
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
    return response
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
};
