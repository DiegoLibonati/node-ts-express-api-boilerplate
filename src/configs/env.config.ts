import type { Env } from "@/types/app";
import type { Envs } from "@/types/env";

export const envs: Envs = {
  PORT: Number(process.env.PORT) || 5050,
  ENV: (process.env.NODE_ENV ?? "development") as Env,
  BASE_URL: process.env.BASE_URL ?? "",
};
