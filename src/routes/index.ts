import { Router } from "express";

import { appointmentRouter } from "./../appointment/Infrastructure/router";
import { clientRouter } from "./../client/infrastructure/router";
import { companyRouter } from "./../company/Infractructure/router";
import { employeeRouter } from "./../employee/Infrastructure/router";
import { serviceRoute } from "./../services/infrastructure/router";
import { teamRoute } from "./../team/infrastructure/router";

export const router = Router();

router.use("/v1/appointment", appointmentRouter);
router.use("/v1/client", clientRouter);
router.use("/v1/company", companyRouter);
router.use("/v1/employee", employeeRouter);
router.use("/v1/service", serviceRoute);
router.use("/v1/team", teamRoute);
