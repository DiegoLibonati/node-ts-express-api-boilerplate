import type { Envs } from "@/types/env";

import { envs } from "@/configs/env.config";

describe("env.config", () => {
  it("should export PORT as a positive number", () => {
    const exported: Envs = envs;
    expect(typeof exported.PORT).toBe("number");
    expect(exported.PORT).toBeGreaterThan(0);
  });

  it("should default PORT to 5050 when not set in environment", () => {
    expect(envs.PORT).toBe(5050);
  });

  it("should export ENV as a valid Env string", () => {
    const exported: Envs = envs;
    expect(["development", "production", "test"]).toContain(exported.ENV);
  });

  it("should set ENV to test in jest environment", () => {
    expect(envs.ENV).toBe("test");
  });

  it("should export BASE_URL as a string", () => {
    const exported: Envs = envs;
    expect(typeof exported.BASE_URL).toBe("string");
  });

  it("should default BASE_URL to empty string when not set in environment", () => {
    expect(envs.BASE_URL).toBe("");
  });
});
