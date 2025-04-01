import { Module } from '@nestjs/common';
import * as path from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from '../config/logger';
import { UsersModule } from './users.module';
import { TypeOrmConfig } from '../config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '../entities';
import { AppController } from '../controllers/app.controller';
import { UsersService } from '../services/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt.strategy';
import { AppService } from '../services/app.service';
import { RefreshTokenStrategy } from '../refreshtoken.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RmqModule } from '../common/rmq/rabbitmq.module';
import { SERVICES } from '../utils/constants';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, '.env'),
      isGlobal: true,
    }),
    ...(['development', 'production'].includes(process.env.NODE_ENV) // allows to serve static files for development and production because of cdn is not available
      ? [
          ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../../', 'dist/ui'),
            serveRoot: '/assets',
          }),
        ]
      : []),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<string>('REDIS_PORT'),
        ttl: Number(configService.getOrThrow<string>('REDIS_TTL')),
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({ name: SERVICES.AUTHENTICATION }),
    RmqModule.register({ name: SERVICES.FEED }),
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
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TracingInterceptor,
    // },
    ConfigService,
    UsersService,
    AppService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
