import cors from "cors";
import express from "express";

import { router } from "./routes";
import { clientErrorHandler, handlePrismaErros, logErrors } from "./share/infrastructure/middleware/error.handle";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// routers
app.use("/api/", router);

// Middlewares error
app.use(logErrors)
app.use(handlePrismaErros)
app.use(clientErrorHandler)
