import { MigrationInterface, QueryRunner } from 'typeorm';

// The entity has declared targetEmotions/desiredOutcomes as native Postgres text[] arrays
// (@Column('text', { array: true })) for a while, but the live column type was plain text,
// schema drift from before this repo's migration history, never caught because nothing
// exercised the array operators (&&, unnest()) against real data until now. Every call to
// GET /v1/recommendations 500'd as a result. Existing values happen to already be valid
// Postgres array-literal text ('{"a","b"}'), written that way by the driver serializing a
// JS array into a column it (incorrectly) believed was scalar text, so a direct cast
// preserves them exactly, no data loss.
export class FixExperienceArrayColumnTypes1789060000000
  implements MigrationInterface
{
  name = 'FixExperienceArrayColumnTypes1789060000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "targetEmotions" TYPE text[] USING "targetEmotions"::text[]`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "desiredOutcomes" TYPE text[] USING "desiredOutcomes"::text[]`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "desiredOutcomes" TYPE text USING array_to_string("desiredOutcomes", ',')`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "targetEmotions" TYPE text USING array_to_string("targetEmotions", ',')`,
    );
  }
}
