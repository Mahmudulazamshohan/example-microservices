import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/Like';
import { CreateLikeDto } from '../dtos/like.dto';
import { ConnectionsService } from './connections.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly connectionsService: ConnectionsService,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    // Check if like already exists
    const existingLike = await this.likeRepository.findOne({
      where: {
        post_id: createLikeDto.post_id,
        user_id: createLikeDto.user_id,
      },
    });

    if (existingLike) {
      return existingLike;
    }

    const like = this.likeRepository.create(createLikeDto);
    return this.likeRepository.save(like);
  }

  async findByPost(postId: number) {
    return this.likeRepository.find({
      where: { post_id: postId },
      relations: ['user'],
    });
  }

  async remove(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });

    if (like) {
      await this.likeRepository.remove(like);
      return { message: 'Like removed successfully' };
    }

    throw new Error('Like not found');
  }

  async canUserLike(userId: number, postOwnerId: number): Promise<boolean> {
    // Users can always like their own posts
    if (userId === postOwnerId) {
      return true;
    }

    // Check if users are connected
    return this.connectionsService.areUsersConnected(userId, postOwnerId);
  }
}
