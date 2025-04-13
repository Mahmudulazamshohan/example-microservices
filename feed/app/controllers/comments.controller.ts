import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { PostsService } from '../services/posts.service';

@ApiTags('comments')
@Controller('comments')
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User() user: { user_id: number },
  ) {
    // Ensure the user can only create comments for themselves
    if (user.user_id !== createCommentDto.user_id) {
      throw new ForbiddenException(
        'You can only create comments for your own account',
      );
    }

    // Get the post to check if the user can comment on it
    const post = await this.postsService.findOne(createCommentDto.post_id);
    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    // Check if the user can comment on this post
    const canComment = await this.commentsService.canUserComment(
      user.user_id,
      post.user_id,
    );
    if (!canComment) {
      throw new ForbiddenException(
        'You can only comment on posts from users in your network',
      );
    }

    return this.commentsService.create(createCommentDto);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Return all comments for a post.' })
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(+postId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Return the comment.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: { user_id: number },
  ) {
    const comment = await this.commentsService.findOne(+id);
    if (comment?.user_id !== user.user_id) {
      throw new ForbiddenException('You can only update your own comments');
    }
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') id: string, @User() user: { user_id: number }) {
    const comment = await this.commentsService.findOne(+id);
    if (comment?.user_id !== user.user_id) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.commentsService.remove(+id);
  }
}
