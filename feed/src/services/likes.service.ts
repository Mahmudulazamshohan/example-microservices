import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entities/Like';
import { CreateLikeDto } from '../dtos/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async likePost(createLikeDto: CreateLikeDto) {
    const existingLike = await this.likeRepository.findOne({
      where: { user_id: createLikeDto.user_id, post_id: createLikeDto.post_id },
    });
    if (existingLike) throw new Error('User already liked this post');
    const like = this.likeRepository.create(createLikeDto);
    return this.likeRepository.save(like);
  }

  async unlikePost(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    if (like) {
      await this.likeRepository.remove(like);
      return { message: 'Post unliked successfully' };
    }
    throw new Error('Like not found');
  }
}
