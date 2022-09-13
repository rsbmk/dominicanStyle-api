import { PrismaClient, Appointment, Appointment_state } from "@prisma/client";
import dayjs from "dayjs";

import { APPOINTMENT_STATUS, PERIODS } from "../../constants";
import { handleCatch } from "../handleErrors";
import { Periods } from "../../types";
import { Router, Response } from "express";
import {
  validateArray,
  validateIsDate,
  validateManyFilds,
  validateNumberFild,
  ValidatedTimeAppointment,
  isCIValid,
} from "../helpers/validateFnc";

const prisma = new PrismaClient();
export const appointmentRouter = Router();

// GET /api/v1/appointment/:employeeId/employee - Get appointment by employee id
appointmentRouter.get("/:employeeId/employee", (request, response) => {
  const { employeeId } = request.params;

  const employee_id = Number(employeeId);

  const isntEmployeeNumber = validateNumberFild(response, "employeeId", employee_id);
  if (isntEmployeeNumber) return;

  prisma.appointment
    .findMany({
      where: { employee_id },
      include: {
        Client: true,
        Service_Appointment: {
          include: {
            Service: true,
          },
        },
      },
    })
    .then((appointments) => {
      response.json(appointments).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// GET /api/v1/appointment/:client_id/client - Get appointment by client id
appointmentRouter.get("/:client_id/client", (request, response) => {
  const { client_id } = request.params;

  const isntEmployeeNumber = isCIValid(response, client_id, "client_id");
  if (isntEmployeeNumber) return;

  prisma.appointment
    .findMany({
      where: { client_id },
      include: {
        Employee: true,
        Service_Appointment: {
          include: {
            Service: true,
          },
        },
      },
    })
    .then((appointments) => {
      response.json(appointments).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// // GET /api/v1/appointment/:period - Get all appointments by period
// appointmentRouter.get("/:period", (request, response) => {
//   const { period } = request.params;

//   if (!Object.keys(PERIODS).includes(period))
//     return response
//       .status(400)
//       .json({
//         error: "El periodo no es valido",
//         fields: ["period"],
//         message: "Debe ser un periodo valido",
//         nameInput: "period",
//         periods: Object.keys(PERIODS),
//         status: 400,
//       })
//       .end();

//   const start = dayjs(new Date())
//     .startOf(period as Periods)
//     .toJSON();
//   const end = dayjs(new Date())
//     .endOf(period as Periods)
//     .toJSON();

//   prisma.appointment
//     .findMany({
//       where: {
//         appointmentDate: {
//           gte: start,
//           lte: end,
//         },
//       },
//       include: {
//         Client: true,
//         Employee: true,
//         Service_Appointment: {
//           include: { Service: true },
//         },
//       },
//       orderBy: { appointmentDate: "asc" },
//     })
//     .then((appointments) => {
//       response.json(appointments).end();
//     })
//     .catch((error) => handleCatch(error, response))
//     .finally(() => prisma.$disconnect());
// });

//POST /api/v1/appointment - create appointment
type CreateAppointmentBody = {
  appointment: Appointment;
  serviceIds: number[];
};
appointmentRouter.post("/", async (request, response) => {
  const { appointment, serviceIds }: CreateAppointmentBody = request.body;
  const { appointmentDate, client_id, employee_id } = appointment as Appointment;

  const employeeId = Number(employee_id);

  const hasAllfields = validateManyFilds(response, appointment, [
    "appointmentDate",
    "client_id",
    "employee_id",
  ]);
  if (hasAllfields) return;

  const isntEmployeeIdNumber = validateNumberFild(response, "employeeId", employeeId);
  if (isntEmployeeIdNumber) return;

  const isntClientIdValid = isCIValid(response, client_id, "client_id");
  if (isntClientIdValid) return;

  const isValidArray = validateArray(response, serviceIds, "serviceIds");
  if (isValidArray) return;

  const isValidateDate = validateIsDate(response, appointmentDate);
  if (isValidateDate) return;

  const isNotValidDateAppointment = ValidatedTimeAppointment(response, appointmentDate);
  if (isNotValidDateAppointment) return;

  const hasAppointmentInThisDate = await validatedAppointmentExists(
    response,
    employeeId,
    appointmentDate
  );
  if (hasAppointmentInThisDate) return;

  // crear la cita
  prisma.appointment
    .create({
      data: {
        appointmentDate: dayjs(appointmentDate).toJSON(),
        state: APPOINTMENT_STATUS.PENDING as Appointment_state,
        client_id,
        employee_id: employeeId,
        Service_Appointment: {
          create: serviceIds.map((serviceId) => ({ service_id: serviceId })),
        },
      },
      include: {
        Client: true,
        Employee: true,
        Service_Appointment: { include: { Service: true } },
      },
    })
    .then((appointment) => {
      response.status(201).json(appointment).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

const validatedAppointmentExists = async (
  response: Response,
  employeeId: number,
  appointmentDate: Date
) => {
  // buscar si existe una cita en ese horario para ese empleado
  return await prisma.appointment
    .findFirst({
      where: {
        employee_id: {
          equals: employeeId,
        },
        AND: {
          appointmentDate: {
            equals: dayjs(appointmentDate).toJSON(),
          },
        },
        OR: {
          appointmentDate: {
            gte: dayjs(appointmentDate).startOf("hour").toJSON(),
            lte: dayjs(appointmentDate).endOf("hour").toJSON(),
          },
        },
      },
    })
    .then((scheduleExist) => {
      if (Boolean(scheduleExist)) {
        response
          .status(400)
          .json({
            message: "Ya existe una cita en ese horario",
            status: 400,
            error: "Elige otro horario",
            fields: ["appointmentDate"],
            nameInput: "appointmentDate",
            scheduleExist,
          })
          .end();
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log("validatedAppointmentExists ~ error", {error})
      handleCatch(error, response);
      return false;
    })
    .finally(() => prisma.$disconnect());
};
