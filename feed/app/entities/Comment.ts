import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './Post';

@Entity()
export class Comment {
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn({ type: 'number' })
  @IsInt()
  public comment_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'number' })
  @IsInt()
  public post_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'number' })
  @IsInt()
  public user_id: number;

  @ApiProperty({ type: 'number', required: false })
  @Column({ type: 'number', nullable: true })
  @IsInt()
  public parent_comment_id: number | null;

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

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'parent_comment_id' })
  parent: Comment | null;
}
