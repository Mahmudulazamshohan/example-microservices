import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { LikesService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/create-like.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  likePost(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.likePost(createLikeDto);
  }

  @Delete(':post_id/:user_id')
  unlikePost(
    @Param('post_id') postId: number,
    @Param('user_id') userId: number,
  ) {
    return this.likesService.unlikePost(postId, userId);
  }
}
