import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1722869754957 implements MigrationInterface {
  name = 'Migration1722869754957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`userId\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(120) NOT NULL, \`password\` varchar(120) NOT NULL, \`hashedRt\` varchar(300) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, INDEX \`IDX_d72ea127f30e21753c9e229891\` (\`userId\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_d72ea127f30e21753c9e229891\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
