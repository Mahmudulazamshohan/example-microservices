import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './Post';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('increment')
  like_id: number;

  @Column()
  user_id: number;

  @Column()
  post_id: number;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
