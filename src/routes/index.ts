import { Router } from "express";
import { employeesRouter } from "./employees";
import { rolesRouter } from "./role";

export const router = Router();

router.use("/v1/employees", employeesRouter);
router.use("/v1/roles", rolesRouter);
