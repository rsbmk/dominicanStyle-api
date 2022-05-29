import { Employee, PrismaClient } from "@prisma/client";
import { Router } from "express";

import { handleCatch } from "../handleErrors";
import { validateManyFilds, validateNumberFild, validateTelephone } from "../helpers/validateFnc";

export const employeesRouter = Router();
const prisma = new PrismaClient();

// GET /v1/employees - get all employees
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
          message: error.meta?.cause ?? error,
          error: error.message,
          primaError: error,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

// GET /v1/employees/:employeeId - get a single employee
employeesRouter.get("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  validateNumberFild(response, "employeeId", Number(employeeId));

  prisma.employee
    .findUnique({ where: { id: Number(employeeId) }, include: { service: true, team: true } })
    .then((employee) => {
      response.json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// POST /v1/employees - create a new employee
employeesRouter.post("/", (request, response) => {
  const { name, phone, address, teamId }: Employee = request.body;

  validateManyFilds(response, request.body, ["name", "schedule", "phone", "address", "teamId"]);

  validateNumberFild(response, "teamId", teamId);

  validateTelephone(response, phone);

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
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// PUT /v1/employees/:employeeId - update employee
employeesRouter.put("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  const { name, phone, address, teamId }: Employee = request.body;

  validateManyFilds(response, request.body, ["name", "phone", "address", "teamId"]);

  validateNumberFild(response, "employeeId", Number(employeeId));

  validateNumberFild(response, "teamId", Number(teamId));

  validateTelephone(response, phone);

  prisma.employee
    .update({
      where: { id: Number(employeeId) },
      data: {
        name,
        address,
        phone,
        team: { connect: { id: Number(teamId) } },
      },
      include: { team: true, service: true },
    })
    .then((employee) => {
      response.status(200).json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// POST /v1/employees/:employeeId/service - add service to employee
employeesRouter.post("/:employeeId/service", (request, response) => {
  const { employeeId } = request.params;
  const { serviceId } = request.body;

  validateNumberFild(response, "employeeId", Number(employeeId));
  validateNumberFild(response, "serviceId", Number(serviceId));

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
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// get employee with services
employeesRouter.get("/:employeeId/service", (request, response) => {
  const { employeeId } = request.params;

  validateNumberFild(response, "employeeId", Number(employeeId));

  prisma.employeeOnService
    .findFirst({
      where: { employeeId: Number(employeeId) },
      include: { employee: true, service: true },
    })
    .then((employee) => {
      response.json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});
