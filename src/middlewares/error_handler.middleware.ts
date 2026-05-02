import type { NextFunction, Request, Response } from "express";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack ?? err.message);
  res.status(500).json({ code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic });
};
