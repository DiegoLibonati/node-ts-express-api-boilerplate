import { isInteger } from "@/helpers/is_integer.helper";

describe("is_integer.helper", () => {
  describe("isInteger", () => {
    it("should return true for a positive integer string", () => {
      expect(isInteger("1")).toBe(true);
    });

    it("should return true for a large positive integer string", () => {
      expect(isInteger("100")).toBe(true);
    });

    it("should return false for zero", () => {
      expect(isInteger("0")).toBe(false);
    });

    it("should return false for a negative integer string", () => {
      expect(isInteger("-1")).toBe(false);
    });

    it("should return false for a decimal string", () => {
      expect(isInteger("1.5")).toBe(false);
    });

    it("should return true for a string representing a whole number float", () => {
      expect(isInteger("1.0")).toBe(true);
    });

    it("should return false for a non-numeric string", () => {
      expect(isInteger("abc")).toBe(false);
    });

    it("should return false for an empty string", () => {
      expect(isInteger("")).toBe(false);
    });

    it("should return false for a whitespace string", () => {
      expect(isInteger(" ")).toBe(false);
    });
  });
});
