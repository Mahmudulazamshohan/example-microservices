import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { ApiSwagger } from 'src/decorators/api-operation.decorator';
import { ApiResponse } from '@common/interceptors/response.interceptor';
import { Comment } from '@entities/Comments';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiSwagger({
    operationId: 'createComment',
    authentication: false,
    query: { type: CreateCommentDto },
    response: { type: ApiResponse<Comment> },
  })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @ApiSwagger({
    operationId: 'deleteComment',
    authentication: false,
    query: { type: CreateCommentDto },
    response: { type: ApiResponse<{ message: string }> },
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentsService.remove(id);
  }
}
