import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ConnectionsService } from '../services/connections.service';
import { CreateConnectionDto } from '../dtos/create-connection.dto';
import { ApiSwagger } from '../decorators/api-operation.decorator';
import { Connection } from '@entities/Connections';
import { ApiResponse } from '@common/interceptors/response.interceptor';
import { ProducerService } from '@services/producer.service';
import { EventEnvelope } from '@common/types/event-envelope.type';
import { SERVICES } from '@utils/constants';

@Controller('connections')
export class ConnectionsController {
  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  async index() {
    try {
      const event = await this.producerService.sendEventWithResponse<
        EventEnvelope<unknown>,
        unknown
      >(SERVICES.AUTHENTICATION, 'user.context', {
        version: '1.00',
        eventType: 'user.context',
        timestamp: new Date().toISOString(),
        payload: {
          name: 'user1',
          userId: 1,
        },
      });
      return event;
    } catch (e) {
      console.log('RMQ error', e);
    }
    return {};
  }

  @ApiSwagger({
    operationId: 'createConnection',
    auth: false,
    query: CreateConnectionDto,
    response: { type: ApiResponse<Connection> },
  })
  @Post()
  create(@Body() createConnectionDto: CreateConnectionDto) {
    return this.connectionsService.create(createConnectionDto);
  }
  @ApiSwagger({
    operationId: 'getConnections',
    auth: false,
    response: { type: ApiResponse<Connection[]> },
  })
  @Get(':user_id')
  findConnections(@Param('user_id') userId: number) {
    return this.connectionsService.findConnections(userId);
  }

  @Put(':id/accept')
  accept(@Param('id') connectionId: number) {
    return this.connectionsService.updateStatus(connectionId, 'accepted');
  }

  @Put(':id/reject')
  reject(@Param('id') connectionId: number) {
    return this.connectionsService.updateStatus(connectionId, 'rejected');
  }

  @Delete(':id')
  remove(@Param('id') connectionId: number) {
    return this.connectionsService.remove(connectionId);
  }
}
