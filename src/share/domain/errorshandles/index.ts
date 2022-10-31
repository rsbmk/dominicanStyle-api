import { Prisma } from "@prisma/client";

type errorType = Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError;
type errorsCodeType = {
  [key: string]: Function;
};

export const ERRORS_CODE: errorsCodeType = {
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