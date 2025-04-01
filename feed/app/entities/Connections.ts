import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('connections')
export class Connection {
  @ApiProperty({
    type: Number,
    description: 'Connection ID',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  connection_id: number;

  @ApiProperty({
    type: Number,
    description: 'User ID who initiated the connection',
    example: 1001,
  })
  @Column()
  user_id: number;

  @ApiProperty({
    type: Number,
    description: 'User ID who received the connection request',
    example: 1002,
  })
  @Column()
  connected_user_id: number;

  @ApiProperty({
    enum: ['pending', 'accepted', 'rejected'],
    description: 'Connection status',
    default: 'pending',
    example: 'pending',
  })
  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}
