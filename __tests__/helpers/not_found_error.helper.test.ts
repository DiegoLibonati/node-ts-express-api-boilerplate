import { NotFoundError } from "@/helpers/not_found_error.helper";

describe("not_found_error.helper", () => {
  describe("NotFoundError", () => {
    it("should be an instance of Error", () => {
      const error: NotFoundError = new NotFoundError();
      expect(error).toBeInstanceOf(Error);
    });

    it("should be an instance of NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it("should have name NotFoundError", () => {
      const error: NotFoundError = new NotFoundError();
      expect(error.name).toBe("NotFoundError");
    });

    it("should have default message Not found", () => {
      const error: NotFoundError = new NotFoundError();
      expect(error.message).toBe("Not found");
    });

    it("should accept a custom message", () => {
      const error: NotFoundError = new NotFoundError("Resource not found");
      expect(error.message).toBe("Resource not found");
    });
  });
});
