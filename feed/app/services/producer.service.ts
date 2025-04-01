import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Producer } from '../common/rmq/producer';
import { SERVICES } from '../utils/constants';

@Injectable()
export class ProducerService extends Producer {
  protected clientMap: Record<string, ClientProxy>;

  // Inject the ClientProxy instances for the services.
  constructor(
    @Inject(SERVICES.AUTHENTICATION) authentication: ClientProxy,
    @Inject(SERVICES.FEED) feed: ClientProxy,
  ) {
    super();
    this.clientMap = {
      [SERVICES.AUTHENTICATION]: authentication,
      [SERVICES.FEED]: feed,
    };
  }
}
