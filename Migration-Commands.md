Bohat achha — niche main do cheezen seedhe, copy-paste-ready de raha hoon:

1. **“Initial / what you already ran”** — exact step-by-step commands (the safe working flow you used).
2. **“New table / future changes”** — flow to add an entity, generate migration, and apply it to prod.
3. Extra: quick verify + revert commands + a short `package.json` scripts snippet to simplify.

Use these exactly in your project root (where `package.json` is).

---

# 1) Initial / already-done (exact commands you ran)

(Repeat of the exact, working flow you used so it’s easy to rerun)

```bash
# 1. build the project (compiles TS -> dist)
npm run build

# 2. generate migration (use ts-node so TypeORM can read src .ts DataSource)
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
  migration:generate src/database/migrations/InitSchema -d src/database/data-source.ts

# 3. build again (so generated .ts migrations compile to dist/*.js)
npm run build

# 4. run migrations against the production RDS (uses dist/data-source.js)
npx typeorm migration:run -d dist/database/data-source.js
```

> Agar aisi koi migration pehle se generate ho aur tum phir se run karna chaho to TypeORM bol dega **No migrations are pending** — that's fine.

---

# 2) Adding a new table (future workflow) — recommended safe steps

When you add a new entity file (e.g. `src/somefeature/entities/new-thing.entity.ts`), follow this:

```bash
# 1. add new entity file (create the TS entity in src/...)

# 2. build (compile project)
npm run build

# 3. generate migration from src (use ts-node to read TS DataSource)
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
  migration:generate src/database/migrations/AddNewThing -d src/database/data-source.ts

# 4. check the generated migration file (src/database/migrations/<timestamp>-AddNewThing.ts)
#    open it and verify up() contains CREATE TABLE ... for your new entity.

# 5. build again (so migration .ts -> dist/*.js)
npm run build

# 6. run migration on prod DB
npx typeorm migration:run -d dist/database/data-source.js

# 7. verify tables via psql or pgAdmin
# Example psql:
psql "host=$POSTGRES_HOST port=5432 dbname=$POSTGRES_DB user=$POSTGRES_USER" -c "\dt"
```

**Notes / best-practices**

- Always inspect the generated migration file before running it on prod.
- Commit migration file (`src/database/migrations/...`) to git.
- Always `npm run build` after generation so the `.js` migration exists under `dist/` for `migration:run`.
- For CI/CD: run `npm run build` then `npx typeorm migration:run -d dist/database/data-source.js` as part of deployment.

---

# 3) Helpful commands (verify, revert, list)

```bash
# List migrations already applied (psql)
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT * FROM migrations ORDER BY id DESC;"

# Revert last applied migration (safe way to undo last migration)
npx typeorm migration:revert -d dist/database/data-source.js

# Run migrations (again)
npx typeorm migration:run -d dist/database/data-source.js

# Generate migration with custom name (src DataSource)
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate \
  src/database/migrations/YourMigrationName -d src/database/data-source.ts
```

---

# 4) Quick verify SQL (pgAdmin / psql)

In pgAdmin or psql run:

```sql
-- show tables
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

-- describe a specific table (psql)
\d+ users

-- see migrations recorded
SELECT * FROM migrations ORDER BY id DESC;
```

---

# 5) Optional: Add short scripts in `package.json` (so you type less)

Add these to `"scripts"` in your `package.json`:

```json
{
  "scripts": {
    "build": "nest build",
    "migrate:gen": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate",
    "migrate:gen:src": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/database/migrations -d src/database/data-source.ts",
    "migrate:run": "typeorm migration:run -d dist/database/data-source.js",
    "migrate:revert": "typeorm migration:revert -d dist/database/data-source.js"
  }
}
```

Then your workflow becomes:

```bash
npm run build
npm run migrate:gen:src -- AddNewThing          # generates src/database/migrations/<...>-AddNewThing.ts
npm run build
npm run migrate:run
```

(Use `npm run migrate:gen -- src/database/migrations/AddNewThing -d src/database/data-source.ts` if you prefer full control.)

---

# 6) Short checklist before running migrations on prod

- `.env` on the machine running `migration:run` points to the correct production RDS and has correct credentials.
- You inspected the generated migration SQL (open `src/database/migrations/<file>.ts`).
- You built the project so migration JS exists in `dist/`.
- You have a DB backup or snapshot (always take a quick snapshot before applying schema changes in prod).
- You commit the migration file to git so team / CI can use same migration.
