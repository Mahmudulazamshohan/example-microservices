import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comments';
import { CreateCommentDto } from '../dtos/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { comment_id: id },
    });
    if (comment) {
      await this.commentRepository.remove(comment);
      return { message: 'Comment removed successfully' };
    }
    throw new Error('Comment not found');
  }
}
