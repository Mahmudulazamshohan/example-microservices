import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import { ConnectionsService } from './connections.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly connectionsService: ConnectionsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  async findByPost(postId: number) {
    return this.commentRepository.find({
      where: { post_id: postId },
      order: { created_at: 'ASC' },
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    return this.commentRepository.findOne({
      where: { comment_id: id },
      relations: ['user'],
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
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

  async canUserComment(userId: number, postOwnerId: number): Promise<boolean> {
    // Users can always comment on their own posts
    if (userId === postOwnerId) {
      return true;
    }

    // Check if users are connected
    return this.connectionsService.areUsersConnected(userId, postOwnerId);
  }
}
