import type { Request, Response } from "express";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ code: CODES_NOT.foundRoute, message: MESSAGES_NOT.foundRoute });
};
