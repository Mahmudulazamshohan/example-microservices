import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CommentsController } from '@controllers/comments.controller';
import { CommentsService } from '@services/comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  controllers: [CommentsController],
  providers: [ConfigService, CommentsService],
})
export class CommentsModule {}
