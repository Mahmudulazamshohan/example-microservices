import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './Post';

@Entity()
@Index(['user_id', 'post_id'], { unique: true })
export class Like {
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsInt()
  public like_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'int' })
  @IsInt()
  public post_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'int' })
  @IsInt()
  public user_id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
