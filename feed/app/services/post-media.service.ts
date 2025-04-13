import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostMedia } from '../entities/PostMedia';
import { CreatePostMediaDto } from '../dtos/post.dto';

@Injectable()
export class PostMediaService {
  constructor(
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
  ) {}

  async create(createPostMediaDto: CreatePostMediaDto) {
    const media = this.postMediaRepository.create(createPostMediaDto);
    return this.postMediaRepository.save(media);
  }

  async findByPost(postId: number) {
    return this.postMediaRepository.find({
      where: { post_id: postId },
    });
  }

  async findOne(id: number) {
    return this.postMediaRepository.findOne({
      where: { media_id: id },
    });
  }

  async remove(id: number) {
    const media = await this.findOne(id);
    if (media) {
      await this.postMediaRepository.remove(media);
      return { message: 'Media removed successfully' };
    }
    throw new Error('Media not found');
  }
}
