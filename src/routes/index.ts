import { ErrorRequestHandler, Router } from "express";
import { employeesRouter } from "./employees";
const router = Router();

router.use("/v1/employees", employeesRouter);

// handlers errors
const handleRouter: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
    status: 500,
    nameError: err.name,
    messageError: err.message,
  });
};

router.use(handleRouter);

export default router;
