import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { Employee } from "types";
export const employeesRouter = Router();
const prisma = new PrismaClient();

employeesRouter.get("/", (request, response) => {
  prisma.employee
    .findMany()
    .then((employees) => {
      response.json(employees);
    })
    .catch((error) => {
      response.status(500).json({
        message: error.message,
        errorName: error.name,
      });
    })
    .finally(() => prisma.$disconnect());
});

employeesRouter.get("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  prisma.employee
    .findUnique({ where: { id: Number(employeeId) } })
    .then((employee) => {
      response.json(employee).end();
    })
    .catch((error) => {
      response.status(500).json({
        message: error.message,
        errorName: error.name,
      });
    })
    .finally(() => prisma.$disconnect());
});

employeesRouter.post("/", (request, response) => {
  const { name, phone, address, roleId }: Employee = request.body;

  if (!name || !phone || !address || !roleId)
    response
      .status(400)
      .json({
        message: "Todos los campos son requeridos",
        status: 400,
        error: "empty field",
        fields: ["name", "phone", "address", "roleId"],
      })
      .end();

  if (isNaN(roleId))
    response
      .status(400)
      .json({
        message: "The roleId must be a number",
        status: 400,
      })
      .end();

  prisma.employee
    .create({
      data: {
        name,
        address,
        phone,
        role: { connect: { id: Number(roleId) } },
      },
    })
    .then((employee) => {
      response.status(201).json(employee).end();
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
