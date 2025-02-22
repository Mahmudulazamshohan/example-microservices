import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ServeStaticModule } from '@nestjs/serve-static';

import { loggerOptions } from '@config/logger';
import { RmqModule } from '@common/rmq/rabbitmq.module';
import { SERVICES } from '@utils/constants';
import { ProducerService } from '@services/producer.service';

import { CommentsModule } from './comments.module';
import { ConnectionsModule } from './connections.module';
import { PostsModule } from './posts.module';
import { LikesModule } from './likes.module';
import { TypeOrmConfig } from '@config/typeorm';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../', 'dist/public'),
      serveRoot: '/static',
    }),
    TypeOrmConfig,
    RmqModule.register({ name: SERVICES.AUTHENTICATION }),
    RmqModule.register({ name: SERVICES.FEED }),
    CommentsModule,
    ConnectionsModule,
    LikesModule,
    PostsModule,
  ],
  controllers: [],
  providers: [ConfigService, ProducerService],
})
export class AppModule {}
