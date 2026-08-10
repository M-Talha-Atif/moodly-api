import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingExperienceIndexes1762429200000
  implements MigrationInterface
{
  name = 'AddBookingExperienceIndexes1762429200000';

  // CREATE INDEX CONCURRENTLY cannot run inside a transaction block (Postgres
  // rejects it), so this opts the migration out of TypeORM's default transaction wrap.
  public transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // InitSchema (1757937782040) names these tables "booking"/"experience" (singular)
    // with camelCase quoted columns, not the "bookings"/"experiences" snake_case names
    // this migration originally targeted, which never matched the real schema.

    // Composite index for user and experience
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_user_experience
      ON "booking"("userId", "experienceId")
    `);

    // Index for status
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_status
      ON "booking"(status)
    `);

    // Index for created_at (DESC)
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_created_at
      ON "booking"("createdAt" DESC)
    `);

    // Experience indexes
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_experiences_date
      ON "experience"(date)
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_experiences_spots
      ON "experience"("spotsFilled", "totalSpots")
    `);

    // Partial index for active bookings
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_active_bookings
      ON "booking"("userId", "experienceId")
      WHERE status IN ('confirmed', 'waitlisted')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_active_bookings`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_experiences_spots`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_experiences_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_created_at`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookings_status`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_bookings_user_experience`,
    );
  }
}
