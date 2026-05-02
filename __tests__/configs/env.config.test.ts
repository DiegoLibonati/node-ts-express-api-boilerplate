describe("env.config", () => {
  const originalEnv: NodeJS.ProcessEnv = process.env;

  beforeEach((): void => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll((): void => {
    process.env = originalEnv;
  });

  it("should expose all envs with correct values when all required variables are set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    process.env.DB_SCHEMA = "myschema";
    process.env.PORT = "3000";
    process.env.NODE_ENV = "test";
    process.env.BASE_URL = "http://localhost:3000";

    const { envs } = jest.requireActual("@/configs/env.config");

    expect(envs.PORT).toBe(3000);
    expect(envs.ENV).toBe("test");
    expect(envs.BASE_URL).toBe("http://localhost:3000");
    expect(envs.DATABASE_URL).toBe(
      "postgresql://admin:secret@localhost:5433/testdb?schema=myschema"
    );
  });

  it("should default PORT to 5050 when PORT is not set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.PORT;

    const { envs } = jest.requireActual("@/configs/env.config");

    expect(envs.PORT).toBe(5050);
  });

  it("should default ENV to 'development' when NODE_ENV is not set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.NODE_ENV;

    const { envs } = jest.requireActual("@/configs/env.config");

    expect(envs.ENV).toBe("development");
  });

  it("should default DB_SCHEMA to 'public' when DB_SCHEMA is not set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.DB_SCHEMA;

    const { envs } = jest.requireActual("@/configs/env.config");

    expect(envs.DATABASE_URL).toContain("?schema=public");
  });

  it("should default BASE_URL to empty string when BASE_URL is not set", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.BASE_URL;

    const { envs } = jest.requireActual("@/configs/env.config");

    expect(envs.BASE_URL).toBe("");
  });

  it("should throw when DB_HOST is missing", () => {
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.DB_HOST;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Missing required environment variable: DB_HOST");
  });

  it("should throw when DB_PORT is missing", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.DB_PORT;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Missing required environment variable: DB_PORT");
  });

  it("should throw when DB_USER is missing", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_PASSWORD = "secret";
    process.env.DB_NAME = "testdb";
    delete process.env.DB_USER;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Missing required environment variable: DB_USER");
  });

  it("should throw when DB_PASSWORD is missing", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_NAME = "testdb";
    delete process.env.DB_PASSWORD;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Missing required environment variable: DB_PASSWORD");
  });

  it("should throw when DB_NAME is missing", () => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5433";
    process.env.DB_USER = "admin";
    process.env.DB_PASSWORD = "secret";
    delete process.env.DB_NAME;

    expect(() => {
      jest.requireActual("@/configs/env.config");
    }).toThrow("Missing required environment variable: DB_NAME");
  });
});
