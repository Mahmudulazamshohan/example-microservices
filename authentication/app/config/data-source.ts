import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { ENTITIES } from '../entities';

const mysqlConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_NAME,
  synchronize: false,
  migrationsRun: false,
  logging: ['error'],
  entities: ENTITIES,
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.js'],
  maxQueryExecutionTime: 10000,
};

const MysqlDataSource = new DataSource(mysqlConfig);

export { MysqlDataSource, mysqlConfig };
