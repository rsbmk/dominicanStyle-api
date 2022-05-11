import { Router } from "express";
export const employeesRouter = Router();

const EmployeesList = [
  {
    id: 1,
    name: "Roberto Melo",
    phone: "123456789",
    address: "123 Main St",
    nationality: "Dominicana",
    role: "Barber Sop",
  },
];

employeesRouter.get("/", (request, response) => {
  response.status(200).json(EmployeesList).end();
});

employeesRouter.get("/:employeeId", (request, response) => {
  const { employeeId } = request.params;
  const employee = EmployeesList.find((employee) => employee.id === Number(employeeId));
  response.status(302).json(employee).end();
});

employeesRouter.post("/", (request, response) => {
  const { name, phone, address, nationality, role } = request.body;

  if (!name || !phone || !address || !nationality || !role)
    return response.status(400).json({
      message: "Todos los campos son requeridos",
      status: 400,
      error: "empty field",
      fields: ["name", "phone", "address", "nationality", "role"],
    });

  const id = EmployeesList.length + 1;
  EmployeesList.push({ id, name, phone, address, nationality, role });

  response.status(201).json(EmployeesList).end();
});
