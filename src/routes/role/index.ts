import { Router } from "express";
import { PrismaClient } from "@prisma/client";
export const rolesRouter = Router();
const prisma = new PrismaClient();

rolesRouter.get("/", (request, response) => {
  prisma.role
    .findMany()
    .then((roles) => {
      response.json(roles).end();
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

rolesRouter.get("/:roleId", (request, response) => {
  const { roleId } = request.params;
  const id = Number(roleId);

  if (isNaN(id)) {
    response
      .status(400)
      .json({
        message: "Invalid role id. Must be a number",
        status: 400,
      })
      .end();
  }

  prisma.role
    .findFirst({ where: { id } })
    .then((role) => {
      if (!role) {
        response
          .status(404)
          .json({
            message: "Role not found",
            status: 404,
          })
          .end();
      }
      response.json(role).end();
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

rolesRouter.post("/", (request, response) => {
  const { name } = request.body;

  if (!name) {
    response
      .status(400)
      .json({
        message: "The name is required",
        status: 400,
      })
      .end();
  }

  prisma.role
    .create({
      data: {
        name,
      },
    })
    .then((role) => {
      response.status(201).json(role).end();
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
