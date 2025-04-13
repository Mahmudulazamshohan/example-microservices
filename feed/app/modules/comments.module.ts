import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CommentsController } from '@controllers/comments.controller';
import { CommentsService } from '@services/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';
import { ConnectionsModule } from './connections.module';
import { PostsModule } from './posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(ENTITIES),
    ConnectionsModule, // Import ConnectionsModule to make ConnectionsService available
    PostsModule, // Import PostsModule since CommentsController depends on PostsService
  ],
  controllers: [CommentsController],
  providers: [ConfigService, CommentsService],
  exports: [CommentsService], // Export CommentsService if needed by other modules
})
export class CommentsModule {}
