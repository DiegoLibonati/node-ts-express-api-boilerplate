import express from "express";
import morgan from "morgan";

import routes from "@/routes";

import { errorHandler } from "@/middlewares/error_handler.middleware";
import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

import { envs } from "@/configs/env.config";

const app: express.Application = express();

app.use(morgan(envs.ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
