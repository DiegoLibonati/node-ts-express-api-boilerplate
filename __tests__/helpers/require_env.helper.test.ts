import { requireEnv } from "@/helpers/require_env.helper";

describe("require_env.helper", () => {
  describe("requireEnv", () => {
    const testKey = "TEST_REQUIRE_ENV_UNIQUE_KEY";

    afterEach((): void => {
      Reflect.deleteProperty(process.env, testKey);
    });

    it("should return the value when the env var is set", () => {
      process.env[testKey] = "test_value";
      expect(requireEnv(testKey)).toBe("test_value");
    });

    it("should throw when the env var is not set", () => {
      expect(() => requireEnv(testKey)).toThrow(
        `Missing required environment variable: ${testKey}`
      );
    });

    it("should throw when the env var is an empty string", () => {
      process.env[testKey] = "";
      expect(() => requireEnv(testKey)).toThrow(
        `Missing required environment variable: ${testKey}`
      );
    });
  });
});
