import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { mysqlConfig } from './data-source';
import { ENTITIES } from '../entities';

export const TypeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const core = {
      entities: ENTITIES,
      migrations: ['dist/migrations/*.js'],
      autoLoadEntities: true,
      keepConnectionAlive: true,
      synchronize: false,
      migrationsRun: false,
    };

    if (configService.get('NODE_ENV') === 'test') {
      return {
        ...core,
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
      };
    }

    const config = {
      ...mysqlConfig,
      retryAttempts: 20,
      retryDelay: 5000,
    };

    return config as TypeOrmModuleOptions;
  },
});
