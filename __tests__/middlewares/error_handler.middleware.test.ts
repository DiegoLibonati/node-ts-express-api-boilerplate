import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "@/middlewares/error_handler.middleware";

import { CODES_ERROR } from "@/constants/codes.constant";
import { MESSAGES_ERROR } from "@/constants/messages.constant";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const buildNext = (): NextFunction => jest.fn();

describe("error_handler.middleware", () => {
  it("should respond with 500 and generic error body", () => {
    const error: Error = new Error("Unexpected failure");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: CODES_ERROR.generic,
      message: MESSAGES_ERROR.generic,
    });
  });

  it("should not call next", () => {
    const error: Error = new Error("Error");
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("should respond with 500 for errors without a stack", () => {
    const error: Error = new Error("No stack");
    delete error.stack;
    const req: Request = buildReq();
    const res: Response = buildRes();
    const next: NextFunction = buildNext();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
