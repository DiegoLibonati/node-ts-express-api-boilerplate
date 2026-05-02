import { mockEnvs } from "@tests/__mocks__/envs.mock";

process.env.DATABASE_URL = mockEnvs.DATABASE_URL;
process.env.DB_HOST = mockEnvs.DB_HOST;
process.env.DB_PORT = mockEnvs.DB_PORT;
process.env.DB_USER = mockEnvs.DB_USER;
process.env.DB_PASSWORD = mockEnvs.DB_PASSWORD;
process.env.DB_NAME = mockEnvs.DB_NAME;
process.env.DB_SCHEMA = mockEnvs.DB_SCHEMA;
