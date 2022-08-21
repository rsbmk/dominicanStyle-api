import { Router } from "express";

import { appointmentRouter } from "./appointment";
import { clientRouter } from "./client";
import { companyRouter } from "./company";
import { employeeRouter } from "./employees";
import { serviceRoute } from "./services";
import { teamRoute } from "./team";

export const router = Router();

router.use("/v1/appointment", appointmentRouter);
router.use("/v1/client", clientRouter);
router.use("/v1/company", companyRouter);
router.use("/v1/employee", employeeRouter);
router.use("/v1/service", serviceRoute);
router.use("/v1/team", teamRoute);
