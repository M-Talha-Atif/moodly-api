import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVersionColumnToExperience1758302696589
  implements MigrationInterface
{
  name = 'AddVersionColumnToExperience1758302696589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience" ADD "version" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "version"`);
  }
}
