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
    └── 1762429122717-AddRefreshTokenToUser.ts
```

> A stray migration also exists at `src/migrations/AddBookingExperienceIndexes.ts`, outside this folder: `data-source.ts`'s glob pattern is recursive so it's still picked up by the CLI, but new migrations should go in `src/database/migrations/` to keep them in one place.

## Configuration

- **Postgres**: `type: 'postgres'`, driven entirely by `POSTGRES_HOST/PORT/USER/PASSWORD/DB`. `synchronize: NODE_ENV !== 'production'`: entity changes auto-apply to the schema outside production; production must go through a generated migration (`npx typeorm migration:generate`). In production, SSL is enabled using the bundled `certs/rds-ca.pem`.
- **Mongo**: `MONGO_URI` + `MONGO_DB`, no further options set.
- **No explicit pool sizing** is configured for either driver (`extra.max`, `poolSize`, etc. are all absent): see [root README > Scale](../../README.md#scale-current-capacity-and-where-overflow-goes) for what the resulting defaults (`pg` pool `max: 10`, Mongoose `maxPoolSize: 100`) mean for concurrency in practice, and how many connections the API + worker processes together open against Postgres.

## `init.sql`

A root-level `init.sql` mirrors the TypeORM-generated schema by hand (uses the `pgcrypto` and `vector` Postgres extensions): kept as a manual bootstrap/reference script, not consumed by the app itself.
