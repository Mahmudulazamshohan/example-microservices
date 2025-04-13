import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './Post';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity()
export class PostMedia {
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsInt()
  public media_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'int' })
  @IsInt()
  public post_id: number;

  @ApiProperty({ enum: MediaType })
  @Column({
    type: 'enum',
    enum: MediaType,
  })
  @IsEnum(MediaType)
  public media_type: MediaType;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 500 })
  @IsString()
  public media_url: string;

  @ApiProperty({ type: 'string', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsString()
  public caption: string | null;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
