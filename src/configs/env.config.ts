import type { Env } from "@/types/app";
import type { Envs } from "@/types/env";

import { requireEnv } from "@/helpers/require_env.helper";

const DB_HOST = requireEnv("DB_HOST");
const DB_PORT = requireEnv("DB_PORT");
const DB_USER = requireEnv("DB_USER");
const DB_PASSWORD = requireEnv("DB_PASSWORD");
const DB_NAME = requireEnv("DB_NAME");
const DB_SCHEMA = process.env.DB_SCHEMA ?? "public";

export const envs: Envs = {
  PORT: Number(process.env.PORT) || 5050,
  ENV: (process.env.NODE_ENV ?? "development") as Env,
  BASE_URL: process.env.BASE_URL ?? "",
  DATABASE_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}`,
};
