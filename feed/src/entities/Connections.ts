import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn('increment')
  connection_id: number;

  @Column()
  user_id: number;

  @Column()
  connected_user_id: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}
