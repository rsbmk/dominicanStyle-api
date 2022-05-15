import { Router } from "express";
import { Employee, PrismaClient } from "@prisma/client";
export const employeesRouter = Router();
const prisma = new PrismaClient();

// get all employees
employeesRouter.get("/", (request, response) => {
  prisma.employee
    .findMany({
      include: { service: { select: { service: true } }, team: true },
    })
    .then((employees) => {
      response.json(employees).end();
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

// get a single employee
employeesRouter.get("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  if (!employeeId || isNaN(Number(employeeId)))
    return response.status(400).json({
      message: "Invalid employee id. Must be a number",
      status: 400,
    });

  prisma.employee
    .findUnique({ where: { id: Number(employeeId) }, include: { service: true, team: true } })
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

// create a new employee
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

// update employee
employeesRouter.put("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  const { name, phone, address, teamId }: Employee = request.body;

  if (!employeeId || isNaN(Number(employeeId)))
    return response
      .status(400)
      .json({
        message: "Invalid employee id. Must be a number",
        status: 400,
      })
      .end();

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
    .update({
      where: { id: Number(employeeId) },
      data: {
        name,
        address,
        phone,
      },
      include: { team: true, service: true },
    })
    .then((employee) => {
      response.status(200).json(employee).end();
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

// add service to employee
employeesRouter.post("/:employeeId/service", (request, response) => {
  const { employeeId } = request.params;
  const { serviceId } = request.body;

  if (!employeeId || isNaN(Number(employeeId)))
    return response
      .status(400)
      .json({
        message: "Invalid employee id. Must be a number",
        status: 400,
      })
      .end();

  if (!serviceId || isNaN(Number(serviceId)))
    return response
      .status(400)
      .json({
        message: "The serviceId must be a number",
        status: 400,
      })
      .end();

  prisma.employeeOnService
    .create({
      data: {
        employeeId: Number(employeeId),
        serviceId: Number(serviceId),
      },
      include: { employee: true, service: true },
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

// get employee with services
employeesRouter.get("/:employeeId/service", (request, response) => {
  const { employeeId } = request.params;

  if (!employeeId || isNaN(Number(employeeId)))
    return response
      .status(400)
      .json({
        message: "Invalid employee id. Must be a number",
        status: 400,
      })
      .end();

  prisma.employeeOnService
    .findFirst({
      where: { employeeId: Number(employeeId) },
      include: { employee: true, service: true },
    })
    .then((employee) => {
      response.json(employee).end();
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
