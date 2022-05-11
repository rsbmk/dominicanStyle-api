import express from "express";
import handleRouter from "./routes";
const app = express();

app.use(express.json());

app.use("/", handleRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
