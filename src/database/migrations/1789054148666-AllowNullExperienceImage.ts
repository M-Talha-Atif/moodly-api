import { MigrationInterface, QueryRunner } from 'typeorm';

// Auto-generate also wanted to drop and recreate the performance indexes and the
// targetEmotions/desiredOutcomes array columns, false positives from TypeORM diffing
// raw-SQL-created indexes against entity metadata, unrelated to this actual change.
// Trimmed to just the real fix: CreateExperienceDto.image is optional and the controller
// creates an experience before its image is uploaded via a separate endpoint, but the
// column was NOT NULL, so no experience could ever be created without one.
export class AllowNullExperienceImage1789054148666
  implements MigrationInterface
{
  name = 'AllowNullExperienceImage1789054148666';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "image" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" ALTER COLUMN "image" SET NOT NULL`,
    );
  }
}
