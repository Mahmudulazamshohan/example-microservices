import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from './Profile';

@Entity()
@Index(['user_id', 'is_active', 'last_login'])
export class User {
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsInt()
  public user_id: number;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 120 })
  @IsString()
  public username: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 120 })
  @IsString()
  public password: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 300 })
  @IsString()
  public hashed_rt: string;

  @ApiProperty({ type: 'boolean' })
  @Column({ default: false })
  is_active: boolean;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 200 })
  @IsString()
  public firstname: string;

  @ApiProperty({ type: 'string' })
  @Column({ type: 'varchar', length: 200 })
  @IsString()
  public lastname: string;

  @ApiProperty({ type: 'string', required: false })
  @Column({ type: 'varchar', length: 300, nullable: true })
  @IsString()
  public profile_picture_url: string | null;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;
}
