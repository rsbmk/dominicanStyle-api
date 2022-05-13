import { Router } from "express";
import { appointmentRouter } from "./appointment";
import { employeesRouter } from "./employees";
import { serviceRoute } from "./services";
import { teamRoute } from "./team";

export const router = Router();

router.use("/v1/appointment", appointmentRouter);
router.use("/v1/employees", employeesRouter);
router.use("/v1/service", serviceRoute);
router.use("/v1/team", teamRoute);
