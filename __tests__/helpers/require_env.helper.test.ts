import { requireEnv } from "@/helpers/require_env.helper";

describe("require_env.helper", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  it("should return the value when the variable is set", () => {
    process.env.TEST_REQUIRE_VAR = "hello";

    const result: string = requireEnv("TEST_REQUIRE_VAR");

    expect(result).toBe("hello");
  });

  it("should throw with the variable name when the variable is not set", () => {
    delete process.env.TEST_REQUIRE_VAR;

    expect(() => requireEnv("TEST_REQUIRE_VAR")).toThrow(
      "Missing required environment variable: TEST_REQUIRE_VAR"
    );
  });

  it("should throw when the variable is an empty string", () => {
    process.env.TEST_REQUIRE_VAR = "";

    expect(() => requireEnv("TEST_REQUIRE_VAR")).toThrow();
  });
});
