import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from './Comment';
import { Like } from './Like';
import { PostMedia } from './PostMedia';

@Entity()
@Index(['user_id', 'created_at'])
export class Post {
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn({ type: 'number' })
  @IsInt()
  public post_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'number' })
  @IsInt()
  public user_id: number;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'text' })
  @IsString()
  public content: string;

  @ApiProperty({ type: 'boolean' })
  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => PostMedia, (media) => media.post)
  media: PostMedia[];
}
