import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index(['userId'])
export class User {
  @ApiProperty({ type: 'int' })
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsInt()
  public userId: number;

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
  public hashedRt: string;

  @ApiProperty({ type: 'boolean' })
  @Column({ default: true })
  isActive: boolean;
}
