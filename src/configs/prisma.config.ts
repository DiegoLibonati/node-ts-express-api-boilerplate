import { PrismaClient } from "@prisma/client";

import { envs } from "@/configs/env.config";

export const prisma = new PrismaClient({
  datasourceUrl: envs.DATABASE_URL,
  log: envs.ENV === "development" ? ["query", "warn", "error"] : ["error"],
});
