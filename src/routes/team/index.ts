import { Router } from "express";
import { PrismaClient } from "@prisma/client";
export const teamRoute = Router();
const prisma = new PrismaClient();

teamRoute.get("/", (request, response) => {
  prisma.team
    .findMany()
    .then((teams) => {
      response.json(teams).end();
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          message: error.message,
          errorName: error.name,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

teamRoute.get("/:teamId", (request, response) => {
  const { teamId } = request.params;
  const id = Number(teamId);

  if (isNaN(id)) {
    return response
      .status(400)
      .json({
        message: "Invalid role id. Must be a number",
        status: 400,
      })
      .end();
  }

  prisma.team
    .findFirst({ where: { id } })
    .then((team) => {
      if (team === null) {
        return response
          .status(404)
          .json({
            message: "Role not found",
            status: 404,
          })
          .end();
      }
      response.json(team).end();
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          message: error.message,
          errorName: error.name,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

teamRoute.post("/", (request, response) => {
  const { name } = request.body;

  if (!name) {
    return response
      .status(400)
      .json({
        message: "The name is required",
        status: 400,
      })
      .end();
  }

  prisma.team
    .create({
      data: {
        name,
      },
    })
    .then((team) => {
      response.status(201).json(team).end();
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          message: error.message,
          errorName: error.name,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});
