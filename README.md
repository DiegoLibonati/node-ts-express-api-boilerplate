# Node Ts Express Api Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Node Ts Express Api Boilerplate** is a production-ready starting point for building REST APIs with Node.js, Express, and TypeScript. It is not a framework or a library — it is the foundation you clone once and stop rebuilding from scratch on every new backend project.

**The problem it solves:** every Node.js + Express + TypeScript project starts with the same repetitive decisions — how to structure folders, how to wire up middleware, where to put types, how to handle environment variables safely, and how to configure linting and formatting so they actually block bad code before it reaches the repo. This boilerplate answers all of those decisions upfront, with a consistent, lightweight architecture that scales to real applications without introducing unnecessary complexity.

**What it includes:**

- **Express 4 + TypeScript 5** — strict typing enforced throughout, with `NodeNext` module resolution for clean CommonJS output and path aliases (`@/`) for readable imports.
- **In-memory store** — the DAO layer uses a module-level array as the data store. It includes a `Note` model as a reference CRUD implementation. Replace the store with any database or ORM of your choice — the layers above it stay unchanged.
- **Docker-first workflow** — separate `Dockerfile.development` and `Dockerfile.production`, plus `dev.docker-compose.yml`. The dev container mounts the source with hot-reload; the production image runs a compiled, pruned build.
- **Layered architecture** — clear separation between DAOs (data access), Services (business logic), Controllers (HTTP handling), and Routes. Each layer has a single responsibility and depends only on the layer below it.
- **Environment configuration** — variables are read and composed into a typed `Envs` object at startup. Crashes fast with a clear message if any required variable is missing.
- **Morgan** request logging — `dev` format in development, `combined` format in production.
- **Centralized error handling** — `errorHandler` and `notFoundHandler` middlewares catch unhandled errors and missing routes consistently. A `NotFoundError` class is provided for signalling 404s from the DAO layer without leaking internals to controllers.
- **Jest + Supertest** — test suite configured with `ts-jest`, in-memory store reset between tests via `resetNoteStore`, and path alias mapping so tests import from `@/` just like source files.
- **ESLint + Prettier + Husky + lint-staged** — pre-commit hooks block commits with linting errors and auto-format staged files. No manual formatting steps required.

**How to use it:**

1. Clone the repository and install dependencies.
2. Copy `.env.example` to `.env` and fill in your values.
3. Start the stack with Docker Compose.
4. Replace the `Note` model, DAO, service, controller, and routes with your own domain logic — the folder structure, middleware setup, error handling, and tooling stay exactly as they are.

The next sections walk through the technology stack, the local setup, the runtime configuration, and finally the path to a deployable production build.

## Technologies Used

1. Node.js
2. TypeScript
3. Express
4. Docker

## Libraries Used

### Dependencies

```
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
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

> **Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed.

1. Clone the repository.
2. Navigate to the project folder.
3. Copy `.env.example` to `.env` and fill in the values (see [Env Keys](#env-keys) for the full reference).
4. Build the Docker image: `docker-compose -f dev.docker-compose.yml build --no-cache`
5. Start the container: `docker-compose -f dev.docker-compose.yml up --force-recreate`

The API will be available at `http://localhost:5050`.

If you prefer to run the dev server outside Docker:

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run type-check` | Run TypeScript type checking |

### Pre-Commit for Development

Code quality and formatting are enforced automatically on every commit by ESLint, Prettier, Husky, and lint-staged. No manual formatting step is required, and commits with errors are blocked before they reach the repo.

#### ESLint

Configured with TypeScript strict rules (`strictTypeChecked` + `stylisticTypeChecked`):

- Explicit return types required on all functions
- No `any` type allowed
- Consistent type imports enforced (`import type`)
- Interfaces preferred over type aliases
- No unused variables (args prefixed with `_` are exempt)
- `===` required — no loose equality
- `console` usage warns; `debugger` is an error
- Relaxed rules inside `__tests__/` to allow unsafe assertions and `any` in test code

#### Prettier

Automatic code formatting on save and on commit:

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (ES5)
- Max line width: 100 characters
- LF line endings

#### Husky + lint-staged

Pre-commit hooks that automatically:

- Run ESLint with auto-fix on staged `.ts` files
- Format `.ts`, `.json`, and `.md` files with Prettier
- Block commits with linting errors

#### Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run lint`         | Check for linting errors         |
| `npm run lint:fix`     | Fix linting errors               |
| `npm run lint:all`     | Fix linting errors (src + tests) |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check code formatting            |
| `npm run format:all`   | Format code (src + tests)        |

## Env Keys

Variables consumed by `src/configs/env.config.ts`. Missing required values cause the process to throw at startup, before the HTTP server binds.

| Key                   | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `PORT`                | Port the HTTP server listens on.                                       |
| `NODE_ENV`            | Runtime environment (`development`, `production`, `test`).             |
| `BASE_URL`            | Base URL of the API (optional).                                        |
| `CHOKIDAR_USEPOLLING` | Enable polling for file watching (`true`/`false`). Required on Docker. |
| `CHOKIDAR_INTERVAL`   | Polling interval in milliseconds (e.g. `100`).                         |

```bash
PORT=5050
NODE_ENV=development
BASE_URL=

CHOKIDAR_USEPOLLING=true
CHOKIDAR_INTERVAL=100
```

## Project Structure

```
node-ts-express-api-boilerplate/
├── __tests__/                          # Test suite
│   ├── __mocks__/
│   │   └── notes.mock.ts               # Shared mock Note object
│   └── jest.setup.ts                   # Per-test setup (timeout + store reset)
├── src/
│   ├── configs/
│   │   └── env.config.ts               # Reads and composes environment variables
│   ├── constants/
│   │   ├── codes.constant.ts           # Response code strings
│   │   └── messages.constant.ts        # Response message strings
│   ├── controllers/
│   │   └── note.controller.ts          # HTTP handlers for the Note resource
│   ├── daos/
│   │   └── note.dao.ts                 # In-memory data store (array + CRUD operations)
│   ├── helpers/
│   │   ├── get_exception_message.helper.ts  # Maps errors to HTTP status + message
│   │   ├── is_integer.helper.ts             # Validates string as positive integer
│   │   ├── not_found_error.helper.ts        # NotFoundError class for 404 signalling
│   │   └── require_env.helper.ts            # Throws if an env variable is missing
│   ├── middlewares/
│   │   ├── error_handler.middleware.ts      # Catches unhandled errors
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
│   │   ├── env.ts                      # Envs interface
│   │   ├── helpers.ts                  # ExceptionInfo interface
│   │   ├── models.ts                   # Note interface
│   │   └── payloads.ts                 # Input types (NoteCreatePayload, NoteUpdatePayload)
│   ├── app.ts                          # Express app setup (middleware + routes)
│   └── server.ts                       # HTTP server bootstrap + graceful shutdown
├── .env.example                        # Environment variable template
├── dev.docker-compose.yml              # Development stack
├── prod.docker-compose.yml             # Production stack
├── Dockerfile.development              # Dev image (tsx watch + hot reload)
├── Dockerfile.production               # Production image (multi-stage build)
├── eslint.config.js                    # ESLint flat config
├── jest.config.js                      # Jest configuration
├── tsconfig.base.json                  # Shared TypeScript base config
├── tsconfig.app.json                   # App build config
├── tsconfig.test.json                  # Test config
└── tsconfig.json                       # Project references root
```

| Folder / File      | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `__tests__/`       | Test files plus global Jest setup hooks                          |
| `src/configs/`     | Environment validation and composition                           |
| `src/constants/`   | Centralized response codes and messages                          |
| `src/controllers/` | One controller per resource; maps HTTP requests to service calls |
| `src/daos/`        | Data access layer; in-memory store lives here                    |
| `src/helpers/`     | Pure utility functions with no side effects                      |
| `src/middlewares/` | Express middleware for error handling and 404s                   |
| `src/routes/`      | Route definitions grouped by version (`v1/`)                     |
| `src/services/`    | Business logic layer between controllers and DAOs                |
| `src/types/`       | TypeScript interfaces and types, split by concern                |

## Architecture & Design Patterns

The folder layout above maps directly onto the layered design described below — each top-level folder under `src/` corresponds to one layer or one cross-cutting concern.

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
| **DAOs**        | Execute data access operations. No logic beyond data access.                |

### In-Memory Store

The DAO layer uses a module-level array (`notes: Note[]`) and an auto-incrementing `nextId` counter as the backing store. All CRUD operations act on this array. A `resetNoteStore` function is exported for use in tests to ensure a clean slate between test runs.

To replace the in-memory store with a real database, only the DAO layer needs to change — the service, controller, and route layers remain untouched.

### Fail-Fast Initialization

Environment variables are read at startup into a typed `Envs` object. If any required variable is missing, the process throws immediately before the HTTP server binds — preventing silent misconfiguration from reaching production.

### Centralized Error Handling

All errors flow to `errorHandler`, a single Express error middleware registered at the end of the middleware chain. `NotFoundError` (thrown by the DAO when a record is not found) is mapped to HTTP 404 in `getExceptionMessage` so controllers never need to handle store internals directly.

### Data Transfer Object (DTO) pattern

Input types (`NoteCreatePayload`, `NoteUpdatePayload`) are defined in `src/types/payloads.ts` and used as the contract between the controller and the service layer. Controllers sanitize raw request body data (trimming strings, filtering undefined fields) before passing it down.

### Graceful Shutdown

The server listens for `SIGTERM` and `SIGINT` signals. On shutdown, it stops accepting new connections and exits cleanly. A 10-second safety timeout forces exit if the shutdown stalls.

## Testing

The test suite uses Jest with `ts-jest`, Supertest for HTTP-level assertions, and the `resetNoteStore` hook to clear the in-memory DAO between tests — keeping each test fully isolated.

1. Navigate to the project folder.
2. Run the suite:

```bash
npm test
```

For a coverage report:

```bash
npm run test:coverage
```

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run test`          | Run tests               |
| `npm run test:watch`    | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## Security Audit

Once the suite is green, audit dependencies before producing a build.

Check for vulnerabilities:

```bash
npm audit
```

Apply automatic fixes (when a safe upgrade exists):

```bash
npm audit fix
```

## Build

With tests passing and dependencies clean, compile the production artifacts.

The production pipeline runs `tsc` (TypeScript → JavaScript in `dist/`) followed by `tsc-alias` (rewrites `@/` path aliases to relative paths so the compiled output runs without a runtime resolver).

| Command         | Description             |
| --------------- | ----------------------- |
| `npm run build` | Build for production    |
| `npm run start` | Start production server |

The production Docker image wraps this same build inside a multi-stage flow:

- **Multi-stage build** — a `builder` stage compiles TypeScript (`tsc`) and resolves path aliases (`tsc-alias`), then a lean `runner` stage copies only the compiled `dist/` and production `node_modules`. Dev dependencies are stripped with `npm prune --omit=dev`.
- **Non-root user** — the runner stage creates a dedicated `appuser` and drops root privileges before the process starts.
- **No source maps, no hot reload** — the container runs `node dist/server.js` directly.

## Production

Pre-flight checklist before deploying:

1. [Testing](#testing) — full suite green.
2. [Security Audit](#security-audit) — `npm audit` clean (or known-safe).
3. [Build](#build) — production image builds successfully.

Once those pass, configure the runtime environment and distribute the image.

### Configure `.env` for production

Production reads from `.env` via `env_file` in `prod.docker-compose.yml`. Make sure the following are set with production values before deploying:

```bash
NODE_ENV=production
PORT=5050
```

See [Env Keys](#env-keys) for the full variable reference.

### Distribute

Build and start the production stack:

```bash
docker-compose -f prod.docker-compose.yml up --build --force-recreate
```

## Known Issues

None at the moment.

## PostgreSQL + Prisma version

If you need a version of this boilerplate backed by a real database, check out the SQL variant:

[`node-ts-express-sql-api-boilerplate`](https://github.com/DiegoLibonati/node-ts-express-sql-api-boilerplate)

It includes everything in this boilerplate plus PostgreSQL via Prisma ORM, Docker Compose database services, migrations, and a Prisma-connected DAO layer — same architecture, same tooling, same folder structure.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/node-ts-express-api-boilerplate`](https://www.diegolibonati.com.ar/#/project/node-ts-express-api-boilerplate)
