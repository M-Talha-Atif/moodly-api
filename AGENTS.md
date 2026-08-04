# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, or similar) working in this repository. Read this before making changes. For a narrative walkthrough of the product and architecture, read [README.md](README.md) first, this file is the condensed, actionable version.

## What this repo is

A NestJS backend for Moodly, a wellness app. It has two entry points that run as **separate processes**:

- `src/main.ts`: the API server (port 3002). Handles HTTP requests.
- `src/worker/main.ts`: the worker (port 3001). Consumes RabbitMQ events, calls the external FastAPI inference service, and pushes results back over Socket.IO.

Both share the same codebase, the same Postgres/Mongo schemas, and the same `src/` tree, but they are booted independently (`npm run start` vs `npm run start:worker`) and each opens its own database connection pool. See [README.md > Architecture](README.md#architecture) for the full picture.

## Setup and running

```bash
npm install
npm run build          # verify the project compiles, do this before and after any change
npm run start           # API process
npm run start:worker    # worker process, run alongside the API for async features to complete
```

Needs a reachable PostgreSQL, MongoDB, Redis, and RabbitMQ. Copy [`.env.example`](.env.example) to `.env` and fill in real values, `.env` is gitignored and must never be committed.

There is currently **no `npm test` script** even though Jest/ts-jest/supertest are installed (see Known Gaps in the README). If you add tests, add the corresponding script to `package.json` rather than assuming one exists.

## Project layout

Every folder under `src/` that exposes an API or does real work has its own `README.md`. Read the relevant one before editing that module, it documents the exact endpoints, DTOs, and internal wiring so you don't have to reverse-engineer it from the code. Start from [README.md > Module Index](README.md#module-index).

Infrastructure code (Redis, RabbitMQ client, static config, Bull Board) lives under `src/infra/`, not scattered at the top level, see [src/infra/README.md](src/infra/README.md).

## Conventions to follow

- **Response envelope**: controllers return `ResultDto.ok(data, message, statusCode)` or throw an `HttpException` built from `ResultDto.fail(reason, statusCode, errorType)` (`src/common/dto/result.dto.ts`). Keep new endpoints consistent with this shape rather than returning raw objects.
- **DTO validation**: every request body needs a `class-validator`-decorated DTO. The global `ValidationPipe` uses `whitelist: true`, so undeclared fields are silently stripped, not an error, keep DTOs complete.
- **Guards**: protected routes use `JwtCookieGuard` (reads the `jwt` cookie, falls back to a Bearer header) plus `RolesGuard` + `@Roles(...)` where a role check is needed. Don't invent a new auth pattern for a new route.
- **Transactions**: any write that needs atomicity (like the booking capacity check) should go through `TransactionService.withTransaction(...)` (`src/common/services/transaction.service.ts`), not a bare repository call plus a hope.
- **Fire-and-forget side effects**: notifications, attendance creation, and similar non-critical writes are dispatched after the main transaction commits, not awaited, and wrapped in `.catch()`. Follow this pattern for new side effects rather than making the caller wait on them.
- **RabbitMQ vs BullMQ**: use RabbitMQ (`src/infra/rmq`) only for events that must cross the API-process/worker-process boundary. Use BullMQ (`@nestjs/bull`, follow the existing `@Processor`/`@Process` pattern) for delayed or retryable work that stays inside the API process. Don't add a third queueing mechanism.
- **Migrations**: with `synchronize` disabled in production, any entity change needs a matching migration: `npx typeorm migration:generate -n Name`. Don't rely on `synchronize` for production-bound schema changes.

## Writing style for docs, comments, and commit messages

- **Never use the em dash character (—).** Use a period, comma, colon, or restructure the sentence instead. This applies to code comments, README updates, commit messages, and PR descriptions.
- Comments should explain *why*, not *what*. Don't add a comment restating what the next line obviously does. If you're adding a comment to a magic number or string, prefer pulling it into a named constant instead.
- Keep module READMEs in sync: if you add, remove, or change an endpoint, update that module's `README.md` in the same change.

## Git workflow

- Do not commit directly to `main`. Create a branch, commit there, push it, and merge into `main` (via PR or an explicit merge commit) rather than pushing straight to `main`.
- Run `npm run build` before considering a change done. A change that doesn't compile is not finished.
- Don't introduce a new pattern (a new response shape, a new queue library, a new auth guard) when an existing one already covers the case, grep for a similar existing implementation first.

## Known rough edges (don't be surprised by these, see README > Known Gaps for the full list)

- Rate limiting (`ThrottlerModule`) is installed but commented out in `src/app.module.ts`.
- `POST /notification` carries `@Roles('host')` but the route is missing `RolesGuard`, so that restriction currently does nothing.
- The feedback reminder cron expression doesn't match its comment, verify before relying on it.
- `src/experience/experience.controller.ts` (legacy) overlaps with the newer host/user/public split controllers in the same module.
