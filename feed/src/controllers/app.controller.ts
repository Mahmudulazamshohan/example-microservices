import { Controller, Get, Request } from '@nestjs/common';
// import { SERVICES } from '../utils/constants';
// import { ProducerService } from '../services/producer.service';
// import { EventEnvelope } from '@common/types/event-envelope.type';
// type User = { name: string; userId: number };
// type Data = { data: User };
@Controller()
export class AppController {
  // constructor(private readonly producerService: ProducerService) {}

  @Get('/')
  async token(@Request() _: unknown): Promise<unknown> {
    try {
      // const event = await this.producerService.sendEventWithResponse<
      //   EventEnvelope<User>,
      //   Data
      // >(SERVICES.AUTHENTICATION, 'user.context', {
      //   version: '1.00',
      //   eventType: 'user.context',
      //   timestamp: new Date().toISOString(),
      //   payload: {
      //     name: 'user1',
      //     userId: 1,
      //   },
      // });

      // return event;
      return {};
    } catch (e) {
      console.log('RMQ error', e);
    }
    return {};
  }
}
