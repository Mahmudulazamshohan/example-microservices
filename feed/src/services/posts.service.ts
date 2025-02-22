import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/Post';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(userId?: number) {
    if (userId) {
      return this.postRepository.find({ where: { user_id: userId } });
    }
    return this.postRepository.find();
  }

  async findOne(id: number) {
    return this.postRepository.findOne({ where: { post_id: id } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    if (post) {
      await this.postRepository.remove(post);
      return { message: 'Post removed successfully' };
    }
    throw new Error('Post not found');
  }
}
