import { Router } from "express";
import { appointmentRouter } from "./appointment";
import { employeesRouter } from "./employees";
import { teamRoute } from "./team";

export const router = Router();

router.use("/v1/employees", employeesRouter);
router.use("/v1/team", teamRoute);
router.use("/v1/appointment", appointmentRouter);
