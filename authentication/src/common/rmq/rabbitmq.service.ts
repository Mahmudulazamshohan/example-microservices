import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.getOrThrow<string>('RABBIT_MQ_URI')],
        queue: this.configService.getOrThrow<string>(
          `RABBIT_MQ_${queue.toUpperCase()}_QUEUE`,
        ),
        noAck,
        persistent: true,
        queueOptions: {
          durable: false,
          ttl: 6 * 60 * 60 * 1000,
        },
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
