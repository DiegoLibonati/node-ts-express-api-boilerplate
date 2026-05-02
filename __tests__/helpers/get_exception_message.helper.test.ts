import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import type { ExceptionInfo } from "@/types/helpers";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  it("should return 404 for Prisma P2025 error", () => {
    const error: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
      "Record not found",
      { code: "P2025", clientVersion: "5.0.0" }
    );

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result).toEqual({
      status: 404,
      code: CODES_NOT.foundNote,
      message: MESSAGES_NOT.foundNote,
    });
  });

  it("should return 500 for Prisma errors other than P2025", () => {
    const error: PrismaClientKnownRequestError = new PrismaClientKnownRequestError(
      "Unique constraint failed",
      { code: "P2002", clientVersion: "5.0.0" }
    );

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should return 500 for a generic Error", () => {
    const error: Error = new Error("Something exploded");

    const result: ExceptionInfo = getExceptionMessage(error);

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should return 500 for non-Error throwables", () => {
    const result: ExceptionInfo = getExceptionMessage("string error");

    expect(result).toEqual({
      status: 500,
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should return 500 for null", () => {
    const result: ExceptionInfo = getExceptionMessage(null);

    expect(result.status).toBe(500);
  });
});
