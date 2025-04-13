import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection, ConnectionStatus } from '../entities/Connection';
import {
  CreateConnectionDto,
  UpdateConnectionDto,
} from '../dtos/connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  async create(createConnectionDto: CreateConnectionDto) {
    // Check if connection already exists
    const existingConnection = await this.connectionRepository.findOne({
      where: [
        {
          requester_id: createConnectionDto.requester_id,
          addressee_id: createConnectionDto.addressee_id,
        },
        {
          requester_id: createConnectionDto.addressee_id,
          addressee_id: createConnectionDto.requester_id,
        },
      ],
    });

    if (existingConnection) {
      return existingConnection;
    }

    const connection = this.connectionRepository.create(createConnectionDto);
    return this.connectionRepository.save(connection);
  }

  async findAll() {
    return this.connectionRepository.find();
  }

  async findOne(id: number) {
    return this.connectionRepository.findOne({
      where: { connection_id: id },
    });
  }

  async findByUser(userId: number) {
    return this.connectionRepository.find({
      where: [{ requester_id: userId }, { addressee_id: userId }],
      relations: ['requester', 'addressee'],
    });
  }

  async findAcceptedConnectionsForUser(userId: number) {
    return this.connectionRepository.find({
      where: [
        { requester_id: userId, status: ConnectionStatus.ACCEPTED },
        { addressee_id: userId, status: ConnectionStatus.ACCEPTED },
      ],
      relations: ['requester', 'addressee'],
    });
  }

  async areUsersConnected(userId1: number, userId2: number): Promise<boolean> {
    const connection = await this.connectionRepository.findOne({
      where: [
        {
          requester_id: userId1,
          addressee_id: userId2,
          status: ConnectionStatus.ACCEPTED,
        },
        {
          requester_id: userId2,
          addressee_id: userId1,
          status: ConnectionStatus.ACCEPTED,
        },
      ],
    });

    return !!connection;
  }

  async update(id: number, updateConnectionDto: UpdateConnectionDto) {
    await this.connectionRepository.update(id, updateConnectionDto);
    return this.findOne(id);
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
