import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnboardingCompleted1759399186265 implements MigrationInterface {
  name = 'AddOnboardingCompleted1759399186265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "onboardingCompleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "onboardingCompleted"`,
    );
  }
}
