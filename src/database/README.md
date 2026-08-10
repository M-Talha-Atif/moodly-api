# Database Module

`src/database`: configures both database connections used by the app: PostgreSQL (TypeORM) and MongoDB (Mongoose). No HTTP controller; imported by `AppModule` (API process) and `WorkerModule` (worker process) independently, so each process gets its own pair of connection pools.

## Structure

```
database/
├── database.module.ts   # TypeOrmModule.forRootAsync + MongooseModule.forRootAsync
├── data-source.ts        # standalone DataSource used only by the `typeorm` CLI (migrations)
└── migrations/
    ├── 1757937782040-InitSchema.ts
    ├── 1758302696589-AddVersionColumnToExperience.ts
    ├── 1759399186265-AddOnboardingCompleted.ts
    ├── 1762429122717-AddRefreshTokenToUser.ts
    └── 1762429200000-AddBookingExperienceIndexes.ts
```

> `AddBookingExperienceIndexes` used to live outside this folder at `src/migrations/`, with a timestamp that sorted it *before* `InitSchema` and table/column names (`bookings`/`experiences` snake_case) that never matched the real schema (`booking`/`experience`, camelCase columns), so it could never actually run. Moved here, renumbered to run last, and corrected to match the real schema. It also sets `transaction = false` (`CREATE INDEX CONCURRENTLY` can't run inside a transaction), which requires `migrationsTransactionMode: 'each'` on the `data-source.ts` DataSource, TypeORM rejects any per-migration transaction override while the global mode is the default `'all'`.

## Configuration

- **Postgres**: `type: 'postgres'`, driven entirely by `POSTGRES_HOST/PORT/USER/PASSWORD/DB`. `synchronize: NODE_ENV !== 'production'`: entity changes auto-apply to the schema outside production; production must go through a generated migration (`npx typeorm migration:generate`). In production, SSL is `{ rejectUnauthorized: false }`, provider-agnostic rather than a hardcoded CA bundle, since the Postgres host varies by environment (this used to bundle an RDS-specific CA cert, which would fail TLS verification against any other provider, e.g. Neon).
- **Mongo**: `MONGO_URI` + `MONGO_DB`, no further options set.
- **No explicit pool sizing** is configured for either driver (`extra.max`, `poolSize`, etc. are all absent): see [root README > Scale](../../README.md#scale-current-capacity-and-where-overflow-goes) for what the resulting defaults (`pg` pool `max: 10`, Mongoose `maxPoolSize: 100`) mean for concurrency in practice, and how many connections the API + worker processes together open against Postgres.

## `init.sql`

A root-level `init.sql` mirrors the TypeORM-generated schema by hand (uses the `pgcrypto` and `vector` Postgres extensions): kept as a manual bootstrap/reference script, not consumed by the app itself.
