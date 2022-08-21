import { Company, PrismaClient, Prisma } from "@prisma/client";
import { Router } from "express";
import { handleCatch } from "../handleErrors";
import { validateNumberFild } from "../helpers/validateFnc";

export const companyRouter = Router();
const prisma = new PrismaClient();

// GET /api/v1/company - get all companies
companyRouter.get("/", (_, response) => {
  prisma.company
    .findMany()
    .then((companies) => {
      response.json(companies).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// GET /api/v1/company/:companyId - get a single company
companyRouter.get("/:companyId", (request, response) => {
  const { companyId } = request.params;

  const companyIdNumber = Number(companyId);
  const isntNumberCompany = validateNumberFild(response, "companyId", companyIdNumber);
  if (isntNumberCompany) return;

  prisma.company
    .findFirst({ where: { id: companyIdNumber } })
    .then((company) => {
      if (company === null) {
        return response
          .status(404)
          .json({
            message: "Company not found",
            status: 404,
          })
          .end();
      }
      response.json(company).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// POST /api/v1/company - create a new company
companyRouter.post("/", (request, response) => {
  const { name = "" }: Company = request.body;

  if (name === "") return response.status(400).json({ message: "Name is required" }).end();

  prisma.company
    .create({ data: { name } })
    .then((company) => {
      response.json(company).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});
