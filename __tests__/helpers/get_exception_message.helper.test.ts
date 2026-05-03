import type { ExceptionInfo } from "@/types/helpers";

import { NotFoundError } from "@/helpers/not_found_error.helper";

import { getExceptionMessage } from "@/helpers/get_exception_message.helper";

import { CODES_ERROR, CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_ERROR, MESSAGES_NOT } from "@/constants/messages.constant";

describe("get_exception_message.helper", () => {
  describe("getExceptionMessage", () => {
    it("should return 404 with not found info when error is NotFoundError", () => {
      const result: ExceptionInfo = getExceptionMessage(new NotFoundError());

      expect(result).toEqual({
        status: 404,
        code: CODES_NOT.foundNote,
        message: MESSAGES_NOT.foundNote,
      });
    });

    it("should return 500 with generic info when error is a generic Error", () => {
      const result: ExceptionInfo = getExceptionMessage(new Error("unexpected"));

      expect(result).toEqual({
        status: 500,
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should return 500 with generic info when error is a string", () => {
      const result: ExceptionInfo = getExceptionMessage("some string error");

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
    });

    it("should return 500 with generic info when error is null", () => {
      const result: ExceptionInfo = getExceptionMessage(null);

      expect(result.status).toBe(500);
      expect(result.code).toBe(CODES_ERROR.generic);
    });
  });
});
