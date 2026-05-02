import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import type { ExceptionInfo } from "@/types/helpers";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

export const getExceptionMessage = (e: unknown): ExceptionInfo => {
  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === "P2025") {
      return { status: 404, code: CODES_NOT.foundNote, message: MESSAGES_NOT.foundNote };
    }
  }

  return { status: 500, code: CODES_ERROR.generic, message: MESSAGES_ERROR.generic };
};
