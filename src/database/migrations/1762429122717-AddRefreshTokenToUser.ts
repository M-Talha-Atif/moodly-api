import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUser1762429122717 implements MigrationInterface {
  name = 'AddRefreshTokenToUser1762429122717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refreshTokenHash" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "refreshTokenHash"`,
    );
  }
}
