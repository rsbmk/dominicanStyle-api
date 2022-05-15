import { response, Router } from "express";
import { PrismaClient, Appointment } from "@prisma/client";
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
    .catch((err) => {
      res
        .status(500)
        .json({ message: err.message, status: 500, error: err, errorName: err.name })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

// GET /v1/appointment/:id - Get appointment by employee id
appointmentRouter.get("/:employeeId/employee", (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId || isNaN(Number(employeeId)))
    return response.status(400).json({ message: "Employee id is required" }).end();

  prisma.employee
    .findMany({
      where: { id: Number(employeeId) },
      include: {
        appointments: { include: { service: true } },
      },
    })
    .then((appointments) => {
      res.json(appointments).end();
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: err.message, status: 500, error: err, errorName: err.name })
        .end();
    })
    .finally(() => prisma.$disconnect());
});

// create appointment
appointmentRouter.post("/", (request, response) => {
  const { name, shedule, telephone, employeeId, serviceId }: Appointment = request.body;

  if (!name || !shedule || !telephone || !employeeId || !serviceId)
    return response
      .status(400)
      .json({
        error: "Missing data",
        status: 400,
        requiredFields: ["name", "shedule", "telephone", "employeeId", "serviceId"],
      })
      .end();

  if (isNaN(Number(employeeId)) || isNaN(Number(serviceId)))
    return response
      .status(400)
      .json({
        error: "fields must be numbers",
        status: 400,
        requiredFields: ["employeeId", "serviceId"],
      })
      .end();

  const validateNumber = /^09[0-9]{8}$/;
  if (!validateNumber.test(telephone))
    return response
      .status(400)
      .json({
        error: "telephone must be valid",
        status: 400,
        requiredFields: ["Debe iniciar con 09", "Debe tener 10 digitos", "Solo numeros"],
      })
      .end();

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
    })
    .then((appointment) => {
      response.status(201).json(appointment).end();
    })
    .catch((error) => {
      response
        .status(400)
        .json({
          errorMessage: error.message,
          status: 400,
          error,
        })
        .end();
    })
    .finally(() => prisma.$disconnect());
});
