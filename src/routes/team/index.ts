import { Router } from "express";
import { PrismaClient, Team } from "@prisma/client";
import { validateManyFilds, validateNumberFild } from "../helpers/validateFnc";
import { handleCatch } from "../handleErrors";
export const teamRoute = Router();
const prisma = new PrismaClient();

// GET /api/v1/team - get all teams
teamRoute.get("/", (_, response) => {
  prisma.team
    .findMany()
    .then((teams) => {
      response.json(teams).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// GET /api/v1/team/:teamId - get a single team
teamRoute.get("/:teamId", (request, response) => {
  const { teamId } = request.params;

  const teamIdNumber = Number(teamId);
  const isntNumberTeam = validateNumberFild(response, "teamId", teamIdNumber);
  if (isntNumberTeam) return;

  prisma.team
    .findFirst({ where: { id: teamIdNumber } })
    .then((team) => {
      if (team === null) {
        return response
          .status(404)
          .json({
            message: "Role not found",
            status: 404,
          })
          .end();
      }
      response.json(team).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});

// POST /api/v1/team/ - create a new team
teamRoute.post("/", (request, response) => {
  const { name }: Team = request.body;

  const hasEmptyValues = validateManyFilds(response, request.body, ["name"]);
  if (hasEmptyValues) return;

  prisma.team
    .create({
      data: {
        name,
      },
    })
    .then((team) => {
      response.status(201).json(team).end();
    })
    .catch((error) => handleCatch(error, response))
    .finally(() => prisma.$disconnect());
});
