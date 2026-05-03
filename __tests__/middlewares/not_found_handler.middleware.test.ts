import type { Request, Response } from "express";

import { notFoundHandler } from "@/middlewares/not_found_handler.middleware";

import { CODES_NOT } from "@/constants/codes.constant";
import { MESSAGES_NOT } from "@/constants/messages.constant";

const buildRes = (): Response => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return mockRes as unknown as Response;
};

describe("not_found_handler.middleware", () => {
  describe("notFoundHandler", () => {
    it("should return 404 with not found route code and message", () => {
      const req: Request = {} as Request;
      const res: Response = buildRes();

      notFoundHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: CODES_NOT.foundRoute,
        message: MESSAGES_NOT.foundRoute,
      });
    });
  });
});
