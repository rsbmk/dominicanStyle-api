import { PrismaClient, Appointment } from "@prisma/client";
import dayjs from "dayjs";
import { Router } from "express";
import { handleCatch } from "../handleErrors";

import { Periods } from "types";
import { PERIODS } from "../../constants";
import {
  validateIsDate,
  validateManyFilds,
  validateNumberFild,
  validateTelephone,
} from "../helpers/validateFnc";

const prisma = new PrismaClient();
export const appointmentRouter = Router();

// GET /v1/appointment - Get all appointments
appointmentRouter.get("/", (req, response) => {
  prisma.appointment
    .findMany({
      include: {
        employee: true,
        service: true,
      },
    })
    .then((appointments) => {
      response.json(appointments).end();
    })
    .catch((error) => handleCatch(error, response))
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
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// create appointment
appointmentRouter.post("/", async (request, response) => {
  validateManyFilds(response, request.body, [
    "name",
    "schedule",
    "telephone",
    "employeeId",
    "serviceId",
  ]);

  const { name, schedule, telephone, employeeId, serviceId }: Appointment = request.body;

  validateNumberFild(response, "employeeId", employeeId);

  validateNumberFild(response, "serviceId", serviceId);

  validateTelephone(response, telephone);

  validateIsDate(response, new Date(schedule));

  const isLessThanNow = dayjs(schedule).isBefore(dayjs(), "second");

  if (isLessThanNow)
    return response
      .status(400)
      .json({
        message: "No puede crear una cita con una fecha anterior a la actual",
        status: 400,
        error: "Fecha invalida",
        fields: ["schedule"],
        nameInput: "schedule",
      })
      .end();

  try {
    // buscar si existe una cita en ese horario
    const scheduleExist = await prisma.appointment.findFirst({
      where: {
        schedule: {
          equals: dayjs(schedule).toJSON(),
        },
        OR: {
          schedule: {
            gte: dayjs(schedule).startOf("hour").toJSON(),
            lte: dayjs(schedule).endOf("hour").toJSON(),
          },
        },
      },
    });

    if (Boolean(scheduleExist))
      return response
        .status(400)
        .json({
          message: "Ya existe una cita en ese horario",
          status: 400,
          error: "Elige otro horario",
          fields: ["schedule"],
          nameInput: "schedule",
          scheduleExist,
        })
        .end();
  } catch (error) {
    return handleCatch(error, response);
  } finally {
    await prisma.$disconnect();
  }

  // crear la cita
  prisma.appointment
    .create({
      data: {
        name,
        schedule: dayjs(schedule).toJSON(),
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
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// GET /v1/appointment/:period - Get all appointments today
appointmentRouter.get("/:period", (request, response) => {
  const { period } = request.params;

  if (!Object.keys(PERIODS).includes(period))
    return response
      .status(400)
      .json({
        error: "El periodo no es valido",
        fields: ["period"],
        message: "Debe ser un periodo valido",
        nameInput: "period",
        periods: Object.keys(PERIODS),
        status: 400,
      })
      .end();

  const { end, start } = PERIODS[period as Periods];

  prisma.appointment
    .findMany({
      where: {
        schedule: {
          gte: start,
          lte: end,
        },
      },
      include: { employee: true, service: true },
      orderBy: { createdAt: "asc" },
    })
    .then((appointments) => {
      response.json(appointments).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});
