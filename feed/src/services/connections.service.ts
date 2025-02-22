import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from '../entities/Connections';
import { CreateConnectionDto } from '../dtos/create-connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  async create(createConnectionDto: CreateConnectionDto) {
    const connection = this.connectionRepository.create(createConnectionDto);
    return this.connectionRepository.save(connection);
  }

  async findConnections(userId: number) {
    return this.connectionRepository.find({
      where: [{ user_id: userId }, { connected_user_id: userId }],
    });
  }

  async updateStatus(connectionId: number, status: 'accepted' | 'rejected') {
    const connection = await this.connectionRepository.findOne({
      where: { connection_id: connectionId },
    });
    if (!connection) throw new Error('Connection not found');
    connection.status = status;
    return this.connectionRepository.save(connection);
  }

  async remove(connectionId: number) {
    const connection = await this.connectionRepository.findOne({
      where: { connection_id: connectionId },
    });
    if (connection) {
      await this.connectionRepository.remove(connection);
      return { message: 'Connection removed successfully' };
    }
    throw new Error('Connection not found');
  }
}
