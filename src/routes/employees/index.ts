import { Employee, PrismaClient } from "@prisma/client";
import { Router } from "express";

import { handleCatch } from "../handleErrors";
import {
  validateArray,
  validateManyFilds,
  validateNumberFild,
  validateTelephone,
} from "../helpers/validateFnc";

export const employeeRouter = Router();
const prisma = new PrismaClient();

// GET /api/v1/employee - get all employee
employeeRouter.get("/", (_, response) => {
  prisma.employee
    .findMany({
      include: {
        Employee_Team: {
          include: {
            Team: {
              include: {
                Service: true,
              }
            },
          },
        },
      },
    })
    .then((employee) => {
      response.json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// GET /api/v1/employee/:employeeId - get a single employee
employeeRouter.get("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  const employee_Id = Number(employeeId);

  const isntNumberEmployee = validateNumberFild(response, "employeeId", employee_Id);
  if (isntNumberEmployee) return;

  prisma.employee
    .findUnique({
      where: { id: Number(employee_Id) },
      include: {
        Appointment: true,
        Employee_Team: {
          include: {
            Team: {
              include: {
                Service: true,
              }
            },
          },
        },
      },
    })
    .then((employee) => {
      response.json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// get /api/v1/employee/:employeeId/team/:teamId/services - employee with services
// employeeRouter.get("/:employeeId/services", (request, response) => {
//   const { employeeId } = request.params;
//   const employee_id = Number(employeeId);

//   const isntNumberEmployee = validateNumberFild(response, "employeeId", employee_id);
//   if (isntNumberEmployee) return;

//   prisma.employee_Team
//     .findMany({
//       where: { employee_id },
//       include: {
//         Team: {
//           include: {
//             Service: true,
//           },
//         },
//       },
//     })
//     .then((employee) => {
//       response.json(employee).end();
//     })
//     .catch((error) => handleCatch(error, response))
//     .finally(() => prisma.$disconnect());
// });

// POST /api/v1/employee - create a new employee
type EmployeeBody = {
  teamsIds: number[];
  employee: Employee;
};
employeeRouter.post("/", (request, response) => {
  const { teamsIds, employee }: EmployeeBody = request.body;
  const { name, last_name, company_id, address = null, telephone = null } = employee as Employee;

  const hasEmptyValues = validateManyFilds(response, employee, ["name", "company_id", "last_name"]);
  const isntNumberCompany = validateNumberFild(response, "company_id", company_id);
  const isntTelephone = telephone ? validateTelephone(response, telephone) : false;
  const isntTeamIds = validateArray(response, teamsIds, "teamsIds");
  if (hasEmptyValues || isntNumberCompany || isntTeamIds || isntTelephone) return;

  prisma.employee
    .create({
      data: {
        name,
        address,
        telephone,
        last_name,
        company_id,
        Employee_Team: {
          create: teamsIds.map((teamId) => ({ team_id: teamId })),
        },
      },
    })
    .then((employee) => {
      response.status(201).json(employee).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// PUT /api/v1/employee/:employeeId - update employee
// employeeRouter.put("/:employeeId", (request, response) => {
//   const { employeeId } = request.params;
//   const { name, telephone, address, last_name, company_id }: Employee = request.body;

//   const employee_Id = Number(employeeId);

//   const hasEmptyValues = validateManyFilds(response, request.body, [
//     "name",
//     "company_id",
//     "last_name",
//   ]);
//   const isntNumberEmployee = validateNumberFild(response, "employeeId", employee_Id);
//   const isntTelephone = telephone ? validateTelephone(response, telephone) : false;
//   if (hasEmptyValues || isntNumberEmployee || isntTelephone) return;

//   prisma.employee
//     .update({
//       where: { id: employee_Id },
//       data: {
//         name,
//         address,
//         telephone,
//         last_name,
//         company_id,
//       },
//     })
//     .then((employee) => {
//       response.status(200).json(employee).end();
//     })
//     .catch((error) => handleCatch(error, response))
//     .finally(() => prisma.$disconnect());
// });
