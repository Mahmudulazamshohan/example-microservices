import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

@Entity()
@Index(['requester_id', 'addressee_id'], { unique: true })
export class Connection {
  @ApiProperty({ type: 'number' })
  @PrimaryGeneratedColumn({ type: 'number' })
  @IsInt()
  public connection_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'int' })
  @IsInt()
  public requester_id: number;

  @ApiProperty({ type: 'number' })
  @Column({ type: 'int' })
  @IsInt()
  public addressee_id: number;

  @ApiProperty({ enum: ConnectionStatus })
  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  @IsEnum(ConnectionStatus)
  public status: ConnectionStatus;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
