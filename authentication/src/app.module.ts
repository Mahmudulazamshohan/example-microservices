import { Module } from '@nestjs/common';
import * as path from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './config/logger';
import { UsersModule } from './users/users.module';
import { TypeOrmConfig } from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from './entities';
import { AppController } from './app.controller';
import { UsersService } from './users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AppService } from './app.service';
import { RefreshTokenStrategy } from './refreshtoken.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '.env'),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'dist/public'),
      serveRoot: '/static',
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<string>('REDIS_PORT'),
        ttl: Number(configService.getOrThrow<string>('REDIS_TTL')),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>('EXPIRES_IN'),
            algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmConfig,
    TypeOrmModule.forFeature(ENTITIES),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    UsersService,
    AppService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
