import { errorRouter } from "./routes/handleErrors/";
import express from "express";
import { router } from "./routes";

export const app = express();

app.use(express.json());

// routers
app.use("/api/", router);

// handlers errors middleware
app.use(errorRouter);
