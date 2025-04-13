import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from '../entities/Post';
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { ConnectionsService } from './connections.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly connectionsService: ConnectionsService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll(userId?: number) {
    if (userId) {
      return this.postRepository.find({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
      });
    }
    return this.postRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findFeedForUser(userId: number) {
    const connections =
      await this.connectionsService.findAcceptedConnectionsForUser(userId);

    const connectedUserIds = connections
      .map((conn) =>
        conn.requester_id === userId ? conn.addressee_id : conn.requester_id,
      )
      .map(Number);

    connectedUserIds.push(userId);

    // Get posts from connected users
    return this.postRepository.find({
      where: { user_id: In(connectedUserIds) },
      order: { created_at: 'DESC' },
      relations: ['user', 'comments', 'likes', 'media'],
    });
  }

  async findOne(id: number) {
    return this.postRepository.findOne({
      where: { post_id: id },
      relations: ['user', 'comments', 'likes', 'media'],
    });
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
