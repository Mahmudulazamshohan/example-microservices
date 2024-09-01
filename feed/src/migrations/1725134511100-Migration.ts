import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1725134511100 implements MigrationInterface {
  name = 'Migration1725134511100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post\` (\`userId\` int NOT NULL, \`content\` text NOT NULL, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`post\``);
  }
}
