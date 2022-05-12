import cors from "cors";
import express from "express";

import { errorRouter } from "./routes/handleErrors/";
import { router } from "./routes";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// routers
app.use("/api/", router);

// handlers errors middleware
app.use(errorRouter);
