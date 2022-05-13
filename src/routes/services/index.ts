import { Service, PrismaClient } from "@prisma/client";
import { Router } from "express";
export const serviceRoute = Router();
const prisma = new PrismaClient();

serviceRoute.get("/", (request, response) => {
  prisma.service
    .findMany()
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

serviceRoute.post("/", (request, response) => {
  const { name, price, description }: Service = request.body;

  if (!name || !price || !description)
    return response.status(400).json({
      message: "Todos los campos son requeridos",
      status: 400,
      error: "empty field",
      fields: ["name", "price", "description"],
    });

  if (isNaN(price))
    return response.status(400).json({
      message: "El precio debe ser un numero",
      status: 400,
      error: "price must be a number",
    });

  prisma.service
    .create({
      data: {
        name,
        price,
        description,
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
