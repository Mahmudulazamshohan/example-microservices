import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Entity()
export class Post {
  @PrimaryColumn({ type: 'int' })
  @IsInt()
  public userId: number;

  @Column({ type: 'text' })
  @IsString()
  public username: string;

  @Column({ type: 'varchar' })
  @IsString()
  public password: string;
}
