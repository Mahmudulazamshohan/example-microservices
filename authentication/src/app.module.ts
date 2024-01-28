import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './config/logger';
import { UsersModule } from './users/users.module';
import { TypeOrmConfig } from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmConfig,
    TypeOrmModule.forFeature(ENTITIES),
    UsersModule,
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
