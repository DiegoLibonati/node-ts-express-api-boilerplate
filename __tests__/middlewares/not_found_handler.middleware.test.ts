import type { Request, Response } from "express";

import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

const buildReq = (): Request => ({}) as Request;

const buildRes = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("not_found_handler.middleware", () => {
  it("should respond with 404", () => {
    const req: Request = buildReq();
    const res: Response = buildRes();

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should respond with NOT_FOUND_ROUTE code and message", () => {
    const req: Request = buildReq();
    const res: Response = buildRes();

    notFoundHandler(req, res);

    expect(res.json).toHaveBeenCalledWith({
      code: CODES_NOT.foundRoute,
      message: MESSAGES_NOT.foundRoute,
    });
  });
});
