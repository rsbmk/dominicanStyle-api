import { PrismaClient, Service } from "@prisma/client";
import { Router } from "express";

import { validateManyFilds, validateNumberFild } from "../helpers/validateFnc";

export const serviceRoute = Router();
const prisma = new PrismaClient();

// GET /api/v1/service/team/:team_id - get all services
serviceRoute.get("/team/:team_id", (request, response) => {
  const { team_id } = request.params;
  const teamIdNumber = Number(team_id);

  const isntNumberTeam = validateNumberFild(response, "team_id", teamIdNumber);
  if (isntNumberTeam) return;

  prisma.service
    .findMany({
      where: { team_id: teamIdNumber },
    })
    .then((services) => {
      response.json(services).end();
    })
    .catch((error) => {
      response.status(500).json({
        message: error.message,
        errorName: error.name,
      });
    })
    .finally(() => prisma.$disconnect());
});

// POST /api/v1/service - create a new service
serviceRoute.post("/", (request, response) => {
  const { name, price, team_id }: Service = request.body;

  const priceNumber = Number(price);
  const team_idNumber = Number(team_id);

  const hasAllField = validateManyFilds(response, request.body, ["name", "price", "team_id"]);
  const isntNumberTeam = validateNumberFild(response, "team_id", team_idNumber);
  const isntNumberPrice = validateNumberFild(response, "price", priceNumber);
  if (hasAllField || isntNumberPrice || isntNumberTeam) return;

  prisma.service
    .create({
      data: {
        name,
        price: priceNumber,
        team_id: team_idNumber,
      },
    })
    .then((service) => {
      response.status(201).json(service).end();
    })
    .catch((error) => {
      response.status(500).json({
        message: error.message,
        errorName: error.name,
      });
    })
    .finally(() => prisma.$disconnect());
});
