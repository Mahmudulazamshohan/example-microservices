import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Entity()
@Index(['userId'])
export class User {
  @PrimaryColumn({ type: 'int' })
  @IsInt()
  public userId: number;

  @Column({ type: 'varchar', length: 120 })
  @IsString()
  public username: string;

  @Column({ type: 'varchar', length: 120 })
  @IsString()
  public password: string;

  @Column({ default: true })
  isActive: boolean;
}
