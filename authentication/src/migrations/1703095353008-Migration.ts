import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703095353008 implements MigrationInterface {
  name = 'Migration1703095353008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_d72ea127f30e21753c9e229891\` ON \`user\` (\`userId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_d72ea127f30e21753c9e229891\` ON \`user\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isActive\``);
  }
}
