import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './Comments';
import { Like } from './Like';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
  post_id: number;

  @Column()
  user_id: number; // Reference to the user in the authentication service

  @Column('text')
  content: string;

  @Column({ nullable: true })
  media_url?: string;

  @CreateDateColumn()
  created_at?: Date;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments?: Comment[];

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes?: Like[];
}
