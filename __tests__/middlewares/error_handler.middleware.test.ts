import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("error_handler.middleware", () => {
  describe("errorHandler", () => {
    it("should return 500 with generic error code and message", () => {
      const err: Error = new Error("Something went wrong");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: NextFunction = jest.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_ERROR.generic,
        message: MESSAGES_ERROR.generic,
      });
    });

    it("should not call next", () => {
      const err: Error = new Error("Error");
      const req: Request = {} as Request;
      const res: Response = buildRes();
      const next: jest.Mock = jest.fn();

      errorHandler(err, req, res, next);

      expect(next).not.toHaveBeenCalled();
    });
  });
});
