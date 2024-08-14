import { Module } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

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

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: await fs.readFileSync(
          path.join(__dirname, '../private.key'),
          'utf8',
        ),
        publicKey: await fs.readFileSync(
          path.join(__dirname, '../public.key'),
          'utf8',
        ),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('EXPIRES_IN'),
          algorithm: 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmConfig,
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
