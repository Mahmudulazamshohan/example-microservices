import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';

@ApiTags('posts')
@Controller('posts')
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: { user_id: number },
  ) {
    // Ensure the user can only create posts for themselves
    if (user.user_id !== createPostDto.user_id) {
      throw new ForbiddenException(
        'You can only create posts for your own account',
      );
    }
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts or posts by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all posts or posts by user ID.',
  })
  findAll(@Query('user_id') userId?: number) {
    return this.postsService.findAll(userId);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get feed for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Return feed for the authenticated user.',
  })
  getFeed(@User() user: { user_id: number }) {
    return this.postsService.findFeedForUser(user.user_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Return the post.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: { user_id: number },
  ) {
    const post = await this.postsService.findOne(+id);
    if (post?.user_id !== user.user_id) {
      throw new ForbiddenException('You can only update your own posts');
    }
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @User() user: { user_id: number }) {
    const post = await this.postsService.findOne(+id);
    if (post?.user_id !== user.user_id) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.postsService.remove(+id);
  }
}
