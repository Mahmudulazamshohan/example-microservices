import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703093908795 implements MigrationInterface {
  name = 'Migration1703093908795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`userId\` int NOT NULL, \`username\` varchar(120) NOT NULL, \`password\` varchar(120) NOT NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
