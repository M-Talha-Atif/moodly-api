import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookingExperienceIndexes1723829400000
  implements MigrationInterface
{
  name = 'AddBookingExperienceIndexes1723829400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Composite index for user and experience
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_user_experience 
      ON bookings(user_id, experience_id)
    `);

    // Index for status
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_status 
      ON bookings(status)
    `);

    // Index for created_at (DESC)
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_bookings_created_at 
      ON bookings(created_at DESC)
    `);

    // Experience indexes
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_experiences_date 
      ON experiences(date)
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_experiences_spots 
      ON experiences(spots_filled, total_spots)
    `);

    // Partial index for active bookings
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY idx_active_bookings 
      ON bookings(user_id, experience_id) 
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
