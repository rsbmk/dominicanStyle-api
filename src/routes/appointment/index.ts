import { Router } from "express";
import { PrismaClient, Appointment } from "@prisma/client";
import { validateManyFilds, validateNumberFild, validateTelephone } from "../helpers/validateFnc";
const prisma = new PrismaClient();

export const appointmentRouter = Router();

// GET /v1/appointment - Get all appointments
appointmentRouter.get("/", (req, res) => {
  prisma.appointment
    .findMany({
      include: {
        employee: true,
        service: true,
      },
    })
    .then((appointments) => {
      res.json(appointments).end();
    })
    .catch((error) => {
      res
        .status(500)
        .json({
          message: error.meta.cause,
          status: 400,
          error: error.message,
          primaError: error,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

// GET /v1/appointment/:id - Get appointment by employee id
appointmentRouter.get("/:employeeId/employee", (request, response) => {
  const { employeeId } = request.params;

  validateNumberFild(response, "employeeId", Number(employeeId));

  prisma.employee
    .findMany({
      where: { id: Number(employeeId) },
      include: {
        appointments: { include: { service: true } },
      },
    })
    .then((appointments) => {
      response.json(appointments).end();
    })
    .catch((error) => {
      response
        .status(500)
        .json({
          message: error.meta.cause,
          status: 400,
          error: error.message,
          primaError: error,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

// create appointment
appointmentRouter.post("/", (request, response) => {
  validateManyFilds(response, request.body, [
    "name",
    "shedule",
    "telephone",
    "employeeId",
    "serviceId",
  ]);

  const { name, shedule, telephone, employeeId, serviceId }: Appointment = request.body;

  validateNumberFild(response, "employeeId", employeeId);

  validateNumberFild(response, "serviceId", serviceId);

  validateTelephone(response, telephone);

  prisma.appointment
    .create({
      data: {
        name,
        shedule: new Date(shedule),
        telephone,
        employee: {
          connect: {
            id: Number(employeeId),
          },
        },
        service: {
          connect: {
            id: Number(serviceId),
          },
        },
      },
      include: { employee: true, service: true },
    })
    .then((appointment) => {
      response.status(201).json(appointment).end();
    })
    .catch((error) => {
      response
        .status(400)
        .json({
          message: error?.meta.cause ?? error.message,
          status: 400,
          error: error.message,
          primaError: error,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

appointmentRouter.post("/search/date/", (request, response) => {
  const { startAt, endAt } = request.body;

  validateManyFilds(response, request.body, ["startAt, endAt"]);

  prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: new Date(endAt),
        gte: new Date(startAt),
      },
    },
  });
});
