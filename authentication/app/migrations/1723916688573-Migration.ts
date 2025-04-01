import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1723916688573 implements MigrationInterface {
  name = 'Migration1723916688573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`profile\` (\`profile_id\` int NOT NULL AUTO_INCREMENT, \`headline\` varchar(255) NULL, \`summary\` text NULL, \`location\` varchar(255) NULL, \`industry\` varchar(255) NULL, \`website_url\` varchar(255) NULL, \`user_id\` int NULL, INDEX \`IDX_b0465dda30314a8786db3354a6\` (\`profile_id\`), UNIQUE INDEX \`REL_d752442f45f258a8bdefeebb2f\` (\`user_id\`), PRIMARY KEY (\`profile_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(120) NOT NULL, \`password\` varchar(120) NOT NULL, \`hashed_rt\` varchar(300) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`firstname\` varchar(200) NOT NULL, \`lastname\` varchar(200) NOT NULL, \`profile_picture_url\` varchar(300) NULL, \`last_login\` datetime NULL, INDEX \`IDX_1f8d876b5e92ae70143da7be77\` (\`user_id\`, \`is_active\`, \`last_login\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_d752442f45f258a8bdefeebb2f2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_d752442f45f258a8bdefeebb2f2\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1f8d876b5e92ae70143da7be77\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_d752442f45f258a8bdefeebb2f\` ON \`profile\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b0465dda30314a8786db3354a6\` ON \`profile\``,
    );
    await queryRunner.query(`DROP TABLE \`profile\``);
  }
}
