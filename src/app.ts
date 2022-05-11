import express from "express";
import handleRouter from "./routes";
const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ Hello: "World" });
});

app.use("/", handleRouter);


export default app;
