import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Entity()
export class Post {
  @PrimaryColumn({ type: 'int' })
  @IsInt()
  public userId: number;

  @Column({ type: 'text' })
  @IsString()
  public content: string;
}
