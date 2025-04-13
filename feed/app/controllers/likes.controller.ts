import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { LikesService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/like.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { PostsService } from '../services/posts.service';

@ApiTags('likes')
@Controller('likes')
@ApiBearerAuth()
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully liked.',
  })
  async create(
    @Body() createLikeDto: CreateLikeDto,
    @User() user: { user_id: number },
  ) {
    // Ensure the user can only create likes for themselves
    if (user.user_id !== createLikeDto.user_id) {
      throw new ForbiddenException(
        'You can only like posts with your own account',
      );
    }

    // Get the post to check if the user can like it
    const post = await this.postsService.findOne(createLikeDto.post_id);
    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    // Check if the user can like this post
    const canLike = await this.likesService.canUserLike(
      user.user_id,
      post.user_id,
    );
    if (!canLike) {
      throw new ForbiddenException(
        'You can only like posts from users in your network',
      );
    }

    return this.likesService.create(createLikeDto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all likes for a post' })
  @ApiResponse({ status: 200, description: 'Return all likes for a post.' })
  findByPost(@Param('postId') postId: string) {
    return this.likesService.findByPost(+postId);
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully unliked.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('postId') postId: string, @User() user: { user_id: number }) {
    return this.likesService.remove(+postId, user.user_id);
  }
}
