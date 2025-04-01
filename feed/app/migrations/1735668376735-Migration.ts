import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1735668376735 implements MigrationInterface {
  name = 'Migration1735668376735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`likes\` (\`like_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`post_id\` int NOT NULL, PRIMARY KEY (\`like_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`post_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`content\` text NOT NULL, \`media_url\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`post_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comments\` (\`comment_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`post_id\` int NOT NULL, \`content\` text NOT NULL, PRIMARY KEY (\`comment_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`connections\` (\`connection_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`connected_user_id\` int NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', PRIMARY KEY (\`connection_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_741df9b9b72f328a6d6f63e79ff\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_259bf9825d9d198608d1b46b0b5\` FOREIGN KEY (\`post_id\`) REFERENCES \`posts\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_259bf9825d9d198608d1b46b0b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_741df9b9b72f328a6d6f63e79ff\``,
    );
    await queryRunner.query(`DROP TABLE \`connections\``);
    await queryRunner.query(`DROP TABLE \`comments\``);
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(`DROP TABLE \`likes\``);
  }
}
