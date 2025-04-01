import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConnectionsController } from '@controllers/connections.controller';
import { ConnectionsService } from '@services/connections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '@entities';
import { ProducerService } from '@services/producer.service';
import { SERVICES } from '@utils/constants';
import { RmqModule } from '@common/rmq/rabbitmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(ENTITIES),
    RmqModule.register({ name: SERVICES.AUTHENTICATION }),
    RmqModule.register({ name: SERVICES.FEED }),
  ],
  controllers: [ConnectionsController],
  providers: [ProducerService, ConnectionsService, ConfigService],
})
export class ConnectionsModule {}
