import { Company, PrismaClient, Client } from "@prisma/client";
import { Router } from "express";
import { handleCatch } from "../handleErrors";
import { isCIValid, validateManyFilds, validateTelephone } from "../helpers/validateFnc";

export const clientRouter = Router();
const prisma = new PrismaClient();

//POST /api/v1/client - create a new client
clientRouter.post("/", (request, response) => {
  const { cedula, last_name, name, telephone = null }: Client = request.body;

  const hasEmptyFields = validateManyFilds(response, request.body, ["cedula", "last_name", "name"]);
  const isntCI = isCIValid(response, cedula, "cedula");
  const isValidTelephone = telephone && validateTelephone(response, telephone);
  if (hasEmptyFields || isntCI || isValidTelephone) return;

  prisma.client
    .create({
      data: {
        cedula,
        last_name,
        name,
        telephone,
      },
    })
    .then((client) => {
      response
        .status(201)
        .json({
          client,
          message: "Cliente creado con exito",
          status: 201,
        })
        .end();
    })
    .catch((error) => handleCatch(error, response));
});

// GET /api/v1/client/:cedula - Get client by id
clientRouter.get("/:cedula", (request, response) => {
  const { cedula } = request.params;

  const isntCI = isCIValid(response, cedula, "cedula");
  if (isntCI) return;

  prisma.client
    .findUnique({
      where: { cedula },
    })
    .then((client) => {
      if (!client)
        return response
          .status(404)
          .json({
            message: "El cliente no existe o ingreso una cedula incorrecta",
            status: 400,
            error: "No se encontro el cliente",
            fields: ["cedula"],
            nameInput: "cedula",
          })
          .end();
      response.json(client).end();
    })
    .catch((error) => handleCatch(error, response));
});
