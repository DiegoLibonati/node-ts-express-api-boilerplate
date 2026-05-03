/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  roots: ["<rootDir>/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/jest.setup.ts"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@tests/(.*)$": "<rootDir>/__tests__/$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/server.ts", "!src/types/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
};

export default config;
