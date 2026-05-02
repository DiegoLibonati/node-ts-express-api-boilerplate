# Node Ts Express SQL Api Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed.

1. Clone the repository
2. Navigate to the project folder
3. Copy the environment file and fill.
4. Build the Docker images: docker-compose -f dev.docker-compose.yml build --no-cache
5. Start the containers: docker-compose -f dev.docker-compose.yml up --force-recreate

The API will be available at `http://localhost:5050`.  
Adminer (database UI) will be available at `http://localhost:8080`.

## Description

**Node Ts Express SQL Api Boilerplate** is a production-ready starting point for building REST APIs with Node.js, Express, TypeScript, and PostgreSQL via Prisma. It is not a framework or a library — it is the foundation you clone once and stop rebuilding from scratch on every new backend project.

**The problem it solves:** every Node.js + Express + TypeScript project starts with the same repetitive decisions — how to structure folders, how to wire up middleware, where to put types, how to handle environment variables safely, how to configure linting and formatting so they actually block bad code before it reaches the repo, and how to set up a database with migrations. This boilerplate answers all of those decisions upfront, with a consistent, lightweight architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Express 4 + TypeScript 5** — strict typing enforced throughout, with `NodeNext` module resolution for clean CommonJS output and path aliases (`@/`) for readable imports.
- **Prisma ORM** — schema-first database access with PostgreSQL. Includes a `Note` model as a reference CRUD implementation. Migrations are applied automatically on startup in both development and production.
- **Docker-first workflow** — separate `Dockerfile.development` and `Dockerfile.production`, plus `dev.docker-compose.yml` and `test.docker-compose.yml`. The dev container runs `prisma db push` on startup; the production image runs `prisma migrate deploy` via an entrypoint script.
- **Layered architecture** — clear separation between DAOs (database access), Services (business logic), Controllers (HTTP handling), and Routes. Each layer has a single responsibility and depends only on the layer below it.
- **Environment configuration** — individual `DB_*` variables are validated at startup via `requireEnv` and composed into a `DATABASE_URL`. Crashes fast with a clear message if any required variable is missing.
- **Morgan** request logging — `dev` format in development, `combined` format in production.
- **Centralized error handling** — `errorHandler` and `notFoundHandler` middlewares catch unhandled errors and missing routes consistently. Prisma's `P2025` (record not found) is mapped to HTTP 404 automatically.
- **Jest + Supertest** — test suite configured with `ts-jest`, global setup/teardown that spins up a dedicated PostgreSQL test container via Docker Compose, and a separate `jest.env.ts` for isolated test credentials.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.

**How to use it:**

1. Clone the repository and install dependencies.
2. Copy `.env.example` to `.env` and fill in your database credentials.
3. Start the stack with Docker Compose — migrations run automatically.
4. Replace the `Note` model, DAO, service, controller, and routes with your own domain logic — the folder structure, middleware setup, error handling, and tooling stay exactly as they are.

## Technologies Used

1. Node.js
2. TypeScript
3. Express
4. PostgreSQL
5. Docker

## Libraries Used

### Dependencies

```
"@prisma/client": "^5.20.0"
"express": "^4.21.0"
"morgan": "^1.10.1"
```

### DevDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/morgan": "^1.9.10"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"dotenv-cli": "^11.0.0"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"prisma": "^5.20.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Available Scripts

| Command                  | Description                      |
| ------------------------ | -------------------------------- |
| `npm run dev`            | Start development server         |
| `npm run build`          | Build for production             |
| `npm run start`          | Start production server          |
| `npm run type-check`     | Run TypeScript type checking     |
| `npm run test`           | Run tests                        |
| `npm run test:watch`     | Run tests in watch mode          |
| `npm run test:coverage`  | Run tests with coverage          |
| `npm run lint`           | Check for linting errors         |
| `npm run lint:fix`       | Fix linting errors               |
| `npm run lint:all`       | Fix linting errors (src + tests) |
| `npm run format`         | Format code with Prettier        |
| `npm run format:check`   | Check code formatting            |
| `npm run format:all`     | Format code (src + tests)        |
| `npm run migrate:dev`    | Create and apply a new migration |
| `npm run migrate:deploy` | Apply pending migrations         |
| `npm run db:studio`      | Open Prisma Studio               |

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/node-ts-express-sql-api-boilerplate`](https://www.diegolibonati.com.ar/#/project/node-ts-express-sql-api-boilerplate)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Production

### Build and start

```bash
docker-compose -f prod.docker-compose.yml up --build --force-recreate
```

### What the production image does differently

- **Multi-stage build** — a `builder` stage compiles TypeScript (`tsc`) and resolves path aliases (`tsc-alias`), then a lean `runner` stage copies only the compiled `dist/`, production `node_modules`, and the Prisma schema. Dev dependencies are stripped with `npm prune --omit=dev`.
- **Non-root user** — the runner stage creates a dedicated `appuser` and drops root privileges before the process starts.
- **Automatic database sync on startup** — `entrypoint.production.sh` runs before the server. If `prisma/migrations/` contains migration files it runs `prisma migrate deploy` (applies pending migrations); otherwise it falls back to `prisma db push` (schema sync without migration history).
- **No source maps, no hot reload** — the container runs `node dist/server.js` directly.
- **No Adminer** — `prod.docker-compose.yml` only includes the server and the database.

### Migration workflow

The recommended flow before deploying to production:

1. Make schema changes in `prisma/schema.prisma`.
2. From inside the dev container, create a named migration:
   ```bash
   docker exec -it <dev-server-container> npx prisma migrate dev --name <migration-name>
   ```
3. Commit the generated files in `prisma/migrations/` to the repository.
4. On the next production deploy, `prisma migrate deploy` will apply them automatically.

### Environment variables

Production reads from `.env` via `env_file` in `prod.docker-compose.yml`. Make sure the following are set with production values before deploying:

```bash
NODE_ENV=production
PORT=5050
DB_HOST=boilerplate-db
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=postgresql://<user>:<password>@boilerplate-db:5432/<db>?schema=public
```

## Env Keys

| Key                   | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `PORT`                | Port the HTTP server listens on.                                       |
| `NODE_ENV`            | Runtime environment (`development`, `production`, `test`).             |
| `BASE_URL`            | Base URL of the API (optional).                                        |
| `DB_HOST`             | PostgreSQL host.                                                       |
| `DB_PORT`             | PostgreSQL port.                                                       |
| `DB_USER`             | PostgreSQL user.                                                       |
| `DB_PASSWORD`         | PostgreSQL password.                                                   |
| `DB_NAME`             | PostgreSQL database name.                                              |
| `DB_SCHEMA`           | PostgreSQL schema (defaults to `public`).                              |
| `DATABASE_URL`        | Full connection string used by Prisma CLI.                             |
| `CHOKIDAR_USEPOLLING` | Enable polling for file watching (`true`/`false`). Required on Docker. |
| `CHOKIDAR_INTERVAL`   | Polling interval in milliseconds (e.g. `100`).                         |

```bash
PORT=5050
NODE_ENV=development
BASE_URL=

DB_HOST=boilerplate-db
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret123
DB_NAME=boilerplate_db
DB_SCHEMA=public
DATABASE_URL=postgresql://admin:secret123@boilerplate-db:5432/boilerplate_db?schema=public

CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

## Project Structure

```
node-ts-express-sql-api-boilerplate/
├── __tests__/                          # Test suite
│   ├── jest.globalSetup.ts             # Starts the test DB container and runs migrations
│   ├── jest.globalTeardown.ts          # Stops and removes the test DB container
│   └── jest.setup.ts                   # Per-test setup (global timeout, etc.)
├── prisma/
│   ├── migrations/                     # Auto-generated migration files
│   └── schema.prisma                   # Prisma schema (models + datasource)
├── src/
│   ├── configs/
│   │   ├── env.config.ts               # Reads and validates environment variables
│   │   └── prisma.config.ts            # PrismaClient singleton
│   ├── constants/
│   │   ├── codes.constant.ts           # Response code strings
│   │   └── messages.constant.ts        # Response message strings
│   ├── controllers/
│   │   └── note.controller.ts          # HTTP handlers for the Note resource
│   ├── daos/
│   │   └── note.dao.ts                 # Database access layer (Prisma queries)
│   ├── helpers/
│   │   ├── get_exception_message.helper.ts  # Maps errors to HTTP status + message
│   │   ├── is_integer.helper.ts             # Validates string as positive integer
│   │   └── require_env.helper.ts            # Throws if an env variable is missing
│   ├── middlewares/
│   │   ├── error_handler.middleware.ts  # Catches unhandled errors
│   │   └── not_found_handler.middleware.ts  # Returns 404 for unmatched routes
│   ├── routes/
│   │   ├── v1/
│   │   │   └── note.route.ts           # Note CRUD route definitions
│   │   └── index.ts                    # Mounts all v1 routes under /api/v1
│   ├── services/
│   │   └── note.service.ts             # Business logic layer
│   ├── types/
│   │   ├── app.ts                      # Env union type
│   │   ├── constants.ts                # Types for code/message constant maps
│   │   ├── payloads.ts                    # Input types (NoteCreatePayload, NoteUpdatePayload)
│   │   ├── env.ts                      # Envs interface
│   │   └── helpers.ts                  # ExceptionInfo interface
│   ├── app.ts                          # Express app setup (middleware + routes)
│   └── server.ts                       # HTTP server bootstrap + graceful shutdown
├── .env.example                        # Environment variable template
├── dev.docker-compose.yml              # Development stack (server + db + adminer)
├── prod.docker-compose.yml             # Production stack
├── test.docker-compose.yml             # Isolated test database
├── Dockerfile.development              # Dev image (tsx watch + db push on startup)
├── Dockerfile.production               # Production image (multi-stage build)
├── entrypoint.development.sh           # Dev entrypoint: db push → npm run dev
├── entrypoint.production.sh            # Prod entrypoint: migrate deploy → node dist/server.js
├── eslint.config.js                    # ESLint flat config
├── jest.config.js                      # Jest configuration
├── tsconfig.base.json                  # Shared TypeScript base config
├── tsconfig.app.json                   # App build config
├── tsconfig.test.json                  # Test config
└── tsconfig.json                       # Project references root
```

| Folder / File      | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `__tests__/`       | Test files plus global Jest setup/teardown hooks                 |
| `prisma/`          | Prisma schema and migration history                              |
| `src/configs/`     | Environment validation and singleton clients (Prisma)            |
| `src/constants/`   | Centralized response codes and messages                          |
| `src/controllers/` | One controller per resource; maps HTTP requests to service calls |
| `src/daos/`        | Data access layer; all Prisma queries live here                  |
| `src/helpers/`     | Pure utility functions with no side effects                      |
| `src/middlewares/` | Express middleware for error handling and 404s                   |
| `src/routes/`      | Route definitions grouped by version (`v1/`)                     |
| `src/services/`    | Business logic layer between controllers and DAOs                |
| `src/types/`       | TypeScript interfaces and types, split by concern                |

## Architecture & Design Patterns

### Layered Architecture

The codebase is organized into four explicit layers, each with a single responsibility. A layer only depends on the layer directly below it — no skipping layers.

```
Routes → Controllers → Services → DAOs
```

| Layer           | Responsibility                                                              |
| --------------- | --------------------------------------------------------------------------- |
| **Routes**      | Declare HTTP method + path and delegate to the corresponding controller.    |
| **Controllers** | Parse and validate the HTTP request, call the service, return the response. |
| **Services**    | Contain business logic. Orchestrate calls to one or more DAOs.              |
| **DAOs**        | Execute database queries via Prisma. No logic beyond data access.           |

### Singleton Pattern

`PrismaClient` is instantiated once in `src/configs/prisma.config.ts` and imported wherever database access is needed. This avoids exhausting the connection pool from multiple client instances.

### Fail-Fast Initialization

Environment variables are validated at startup through `requireEnv`. If any required variable is missing, the process throws immediately before the HTTP server binds — preventing silent misconfiguration from reaching production.

### Centralized Error Handling

All errors flow to `errorHandler`, a single Express error middleware registered at the end of the middleware chain. Prisma errors (e.g. `P2025` record not found) are mapped to meaningful HTTP status codes in `getExceptionMessage` so controllers never need to handle Prisma internals directly.

### Data Transfer Object (DTO) pattern

Input types (`NoteCreatePayload`, `NoteUpdatePayload`) are defined in `src/types/payloads.ts` and used as the contract between the controller and the service layer. Controllers sanitize raw request body data (trimming strings, filtering undefined fields) before passing it down.

### Graceful Shutdown

The server listens for `SIGTERM` and `SIGINT` signals. On shutdown, it stops accepting new connections, disconnects Prisma, and exits cleanly. A 10-second safety timeout forces exit if the shutdown stalls.

## Code Quality Tools

### ESLint

Configured with TypeScript strict rules (`strictTypeChecked` + `stylisticTypeChecked`):

- Explicit return types required on all functions
- No `any` type allowed
- Consistent type imports enforced (`import type`)
- Interfaces preferred over type aliases
- No unused variables (args prefixed with `_` are exempt)
- `===` required — no loose equality
- `console` usage warns; `debugger` is an error
- Relaxed rules inside `__tests__/` to allow unsafe assertions and `any` in test code

### Prettier

Automatic code formatting on save and on commit:

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (ES5)
- Max line width: 100 characters
- LF line endings

### Husky + lint-staged

Pre-commit hooks that automatically:

- Run ESLint with auto-fix on staged `.ts` files
- Format `.ts`, `.json`, and `.md` files with Prettier
- Block commits with linting errors

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

Fix vulnerabilities automatically (when a safe upgrade exists):

```bash
npm audit fix
```

## Known Issues

None at the moment.
