---
name: entity-dto-schema-review
description: Review a new or changed TypeORM entity, its DTOs, its migration, and any endpoint that returns it, for schema/DTO mismatches and response data leaks. Use before merging any change that adds/edits an entity, adds/edits a migration, or adds an endpoint that returns an entity relation (like a user) in its response. This project shipped a 500-on-every-request bug, a second 500 from an array-typed column silently drifting to scalar text in the live database, and a live credential leak, all from exactly these gaps, verified in production, not theoretical.
---

# Entity, DTO, and response-shape review

Two real bugs shipped from this exact gap. `POST /host/experiences` returned `500` on every single
call for as long as it existed in production: `experience.image` was `NOT NULL` in Postgres but
`CreateExperienceDto.image` was `@IsOptional()`, and the intended flow (create the experience, then
upload its image via a separate endpoint) never actually worked. Separately, `GET /v1/host/bookings`
returned the booking user's `refreshTokenHash` in the live response body, `ResultDto.sanitizeData`'s
denylist didn't cover that field. Both were only caught by actually creating real data through the
real endpoints and reading the real response, not by reading the code. Do the same here: don't just
read the entity and DTO side by side, trace what a real request/response actually looks like.

## 1. Nullable columns vs optional DTO fields, cross-check every field

For every field in a create DTO marked `@IsOptional()`, find the matching `@Column(...)` on the
entity and confirm it has `nullable: true` (or a `default`). A bare `@Column()` is `NOT NULL` by
default in TypeORM. If the DTO says a field is optional but the column isn't nullable, any request
that omits it will fail at the database level with a generic `500`, the DTO validation passes, the
handler runs, and it dies on `INSERT`. This is invisible from reading the DTO or the controller
alone, you have to check the entity's actual column definition.

Do this check in both directions: also look for entity columns that are `NOT NULL` with no
`@IsOptional()` on the corresponding DTO field, confirm that's intentional and not just unnoticed.

If the intended flow is "create now, fill this field in later via a separate endpoint" (like
experience images, uploaded after creation), the column must be nullable, full stop, no exceptions
for "it'll always be set eventually."

## 2. `@Column('text', { array: true })` claiming a native array: verify the live column actually is one

A third bug, found by actually running a query that used Postgres array operators against real data,
not by reading code: `experience.targetEmotions` and `experience.desiredOutcomes` were declared
`@Column('text', { array: true, nullable: true })` in the entity, TypeORM believed they were
`text[]`, but the live Neon column type was plain scalar `text`. Every query using `&&` (array
overlap) or `unnest()` against them failed with `function unnest(text) does not exist`, this is
exactly what broke `GET /v1/recommendations` for every user, every time, for as long as it existed.

This kind of drift happens silently: writes still "succeed" because the ORM/driver serializes the
JS array into Postgres array-literal text (`{"a","b"}`) and the scalar `text` column happily stores
that as a string, nothing errors until a query tries to use it as an actual array. Reads that don't
touch array operators look completely normal too.

**When you touch a column declared with `array: true` (or `nullable: true` combined with an array
TS type), don't trust the entity, check the real column type**:

```sql
SELECT column_name, data_type, udt_name FROM information_schema.columns
WHERE table_name = '<table>' AND column_name = '<column>';
```

`data_type: 'ARRAY'` / `udt_name` starting with `_` (e.g. `_text`, `_varchar`) is a real native array.
`data_type: 'text'` or `'character varying'` is scalar, even if the entity says otherwise. If they
disagree, that's the bug, write a migration to `ALTER COLUMN ... TYPE text[] USING <col>::text[]`
(existing array-literal-formatted text casts cleanly, no data loss) rather than trusting the entity
declaration is already reality. `@Column('simple-array', ...)` is a different, valid case, TypeORM
deliberately stores that as comma-joined scalar `text` and reconstructs the array in JS on read, it's
only a bug when the entity explicitly declares `array: true` and the column doesn't match.

If a migration ever gets auto-generated and includes a drop-and-readd of an array-typed column you
didn't expect (see the migration-review section below), don't discard it as noise without checking
which case it is first, that's exactly the shape this bug took the first time and it was quietly
dropped as an assumed false positive before actually causing the production 500.

## 3. Every endpoint returning an entity or entity relation: what fields actually leave the server

`ResultDto.ok(data, ...)` runs `sanitizeData` (`src/common/dto/result.dto.ts`), which strips fields
by name: `passwordHash`, `password`, `secretKey`, `refreshTokenHash`. This is a denylist, it only
protects fields already on that list. When a new sensitive field gets added to any entity (a new
token hash, an API key, an internal note, anything not meant for the client), it leaks by default
until someone remembers to add it here.

For any endpoint that returns a `User` (directly, or nested inside a booking, a community post
author, a comment author, anything with a `user` or `host` relation), don't just check that
`ResultDto.ok(...)` is used. Trace the actual relation: is it the full entity (leaks everything not
on the denylist), or a hand-picked subset of fields (like `findBookingsForExperience` in
`experience-host.service.ts` already does correctly, mapping to `{ id, name, email, avatarUrl,
languagePreferences }` explicitly)? The explicit-subset pattern is safer and preferred for anything
new, don't rely on the denylist catching up.

If you add a new sensitive field to any entity, add it to `sanitizeData`'s `removeKeys` in the same
change. That list is the last line of defense for every relation returned anywhere in the app,
treat it as part of the entity's own definition, not a separate concern.

## 4. Migration correctness, especially auto-generated ones

When reviewing a migration, whether hand-written or from `typeorm migration:generate`:

- **Read the full diff it wants to apply, don't assume auto-generate only contains your intended change, and don't assume everything unfamiliar in it is noise.** `typeorm migration:generate` diffs live DB schema against entity metadata and will include unrelated changes it thinks are needed. Some really are false positives (raw-SQL-created indexes not represented in `@Index()` decorators get flagged for drop-and-recreate, that part is safe to discard). Others are the tool correctly reporting real drift (a column typed differently than fresh entity metadata expects, see the array-column case above). This project has one migration that did both at once: an auto-generated diff for a one-line nullable-column change also wanted to drop and recreate 6 indexes (genuine noise, removed by hand) and drop-and-readd `targetEmotions`/`desiredOutcomes` (not noise, that was the array-type drift bug, discarded as if it were the same kind of false positive, which is exactly how it shipped and then broke recommendations in production). Investigate each unexpected statement individually, don't pattern-match "auto-generate always adds noise" onto all of them.
- **`CREATE INDEX CONCURRENTLY` cannot run inside a transaction.** If a migration needs it, the migration class needs `public transaction = false;`, and the DataSource's `migrationsTransactionMode` (`src/database/data-source.ts`) must be `'each'`, not the default `'all'`, or TypeORM rejects the override outright.
- **Migration ordering is by the numeric timestamp in the filename/class name, not by intent or by when you wrote it.** A migration referencing a table or column from another migration needs a timestamp genuinely later than the one that creates it. This project had a migration that predated the table it modified by weeks, in the wrong location entirely (`src/migrations/` instead of `src/database/migrations/`), silently broken since it was written.
- **Table and column names in raw SQL migrations must match the actual entity, not a guess.** Verify every identifier in a raw `queryRunner.query(...)` migration against the entity's actual `@Column()` definitions (name, camelCase vs snake_case, quoting), don't assume the naming convention used elsewhere in the file is correct here too.

## What to report

For each finding: the entity/column or endpoint in question, what a real request/response would
actually contain or fail on, and the concrete fix (add `nullable: true` + a migration, add a field
to the denylist, fix the migration's `up()`). If you can, actually construct the request that would
fail or leak, don't just describe it abstractly.
