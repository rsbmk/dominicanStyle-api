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
