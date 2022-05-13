import { Router } from "express";
import { Employee, PrismaClient } from "@prisma/client";
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
  if (!employeeId || isNaN(Number(employeeId)))
    return response.status(400).json({
      message: "Invalid employee id. Must be a number",
      status: 400,
    });

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
  const { name, phone, address, teamId }: Employee = request.body;

  if (!name || !phone || !address || !teamId)
    return response
      .status(400)
      .json({
        message: "Todos los campos son requeridos",
        status: 400,
        error: "empty field",
        fields: ["name", "phone", "address", "teamId"],
      })
      .end();

  if (isNaN(teamId))
    return response
      .status(400)
      .json({
        message: "The teamId must be a number",
        status: 400,
      })
      .end();

  prisma.employee
    .create({
      data: {
        name,
        address,
        phone,
        team: { connect: { id: Number(teamId) } },
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
