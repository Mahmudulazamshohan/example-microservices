import { runSeeders, SeederOptions } from 'typeorm-extension';
import { mysqlConfig } from '../config/data-source';
import { DataSource, DataSourceOptions } from 'typeorm';
import UserSeeder from './user.seeder';
import UserFactory from './user.factory';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    ...mysqlConfig,
    seeds: [UserSeeder],
    factories: [UserFactory],
  };

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await runSeeders(dataSource);
  process.exit(1);
})();
