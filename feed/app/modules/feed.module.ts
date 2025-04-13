import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from '../services/posts.service';
import { CommentsService } from '../services/comments.service';
import { LikesService } from '../services/likes.service';
import { ConnectionsService } from '../services/connections.service';
import { PostMediaService } from '../services/post-media.service';
import { PostsController } from '../controllers/posts.controller';
import { CommentsController } from '../controllers/comments.controller';
import { LikesController } from '../controllers/likes.controller';
import { ConnectionsController } from '../controllers/connections.controller';
import { PostMediaController } from '../controllers/post-media.controller';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { Like } from '../entities/Like';
import { PostMedia } from '../entities/PostMedia';
import { Connection } from '../entities/Connection';
import { RmqModule } from '@common/rmq/rabbitmq.module';
import { SERVICES } from '@utils/constants';
import { ProducerService } from '@services/producer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Like, PostMedia, Connection]),
    RmqModule.register({ name: SERVICES.AUTHENTICATION }),
    RmqModule.register({ name: SERVICES.FEED }),
  ],
  controllers: [
    PostsController,
    CommentsController,
    LikesController,
    ConnectionsController,
    PostMediaController,
  ],
  providers: [
    PostsService,
    CommentsService,
    LikesService,
    ConnectionsService,
    PostMediaService,
    ProducerService,
    ConfigService,
  ],
  exports: [
    PostsService,
    CommentsService,
    LikesService,
    ConnectionsService,
    PostMediaService,
  ],
})
export class FeedModule {}
