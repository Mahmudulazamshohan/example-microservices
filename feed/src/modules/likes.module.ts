import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LikesController } from '@controllers/likes.controller';
import { LikesService } from '@services/likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature(ENTITIES)],
  controllers: [LikesController],
  providers: [ConfigService, LikesService],
})
export class LikesModule {}
