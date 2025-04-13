import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { PostMediaService } from '../services/post-media.service';
import { CreatePostMediaDto } from '../dtos/post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { PostsService } from '../services/posts.service';

@ApiTags('post-media')
@Controller('post-media')
@ApiBearerAuth()
export class PostMediaController {
  constructor(
    private readonly postMediaService: PostMediaService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add media to a post' })
  @ApiResponse({
    status: 201,
    description: 'The media has been successfully added to the post.',
  })
  async create(
    @Body() createPostMediaDto: CreatePostMediaDto,
    @User() user: { user_id: number },
  ) {
    // Get the post to check if the user owns it
    const post = await this.postsService.findOne(createPostMediaDto.post_id);
    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    // Check if the user owns the post
    if (post.user_id !== user.user_id) {
      throw new ForbiddenException('You can only add media to your own posts');
    }

    return this.postMediaService.create(createPostMediaDto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all media for a post' })
  @ApiResponse({ status: 200, description: 'Return all media for a post.' })
  findByPost(@Param('postId') postId: string) {
    return this.postMediaService.findByPost(+postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiResponse({ status: 200, description: 'Return the media.' })
  @ApiResponse({ status: 404, description: 'Media not found.' })
  findOne(@Param('id') id: string) {
    return this.postMediaService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media' })
  @ApiResponse({
    status: 200,
    description: 'The media has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @User() user: { user_id: number }) {
    const media = await this.postMediaService.findOne(+id);
    if (!media) {
      throw new ForbiddenException('Media not found');
    }

    // Get the post to check if the user owns it
    const post = await this.postsService.findOne(media.post_id);
    if (post?.user_id !== user.user_id) {
      throw new ForbiddenException(
        'You can only delete media from your own posts',
      );
    }

    return this.postMediaService.remove(+id);
  }
}
