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

export const handleCatch = (error: any, response: Response) => {
  return response
    .status(500)
    .json({
      message: error.meta?.cause ?? error,
      status: 400,
      error: error.message,
      primaError: error,
    })
    .end();
};
