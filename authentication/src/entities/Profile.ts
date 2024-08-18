import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity()
@Index(['profile_id'])
export class Profile {
  @PrimaryGeneratedColumn()
  profile_id: number;

  @Column({ nullable: true })
  headline: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website_url: string;

  //   @CreateDateColumn({
  //     type: 'timestamp',
  //     nullable: true,
  //     default: () => 'CURRENT_TIMESTAMP',
  //   })
  //   created_at: Date;

  //   @UpdateDateColumn({
  //     type: 'timestamp',
  //     nullable: true,
  //     default: () => 'CURRENT_TIMESTAMP',
  //   })
  //   updated_at: Date;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
