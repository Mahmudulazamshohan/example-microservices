import { Module } from '@nestjs/common';

import { PostsController } from '@controllers/posts.controller';
import { PostsService } from '@services/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
