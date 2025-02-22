import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProducerService } from '@services/producer.service';

@Injectable()
export class Producer {
  protected clientMap: Record<string, ClientProxy>;
  protected logger = new Logger(ProducerService.name);

  /**
   * Dynamically get a ClientProxy by service name.
   */
  protected getClient(serviceName: string): ClientProxy {
    const client = this.clientMap[serviceName];
    if (!client) {
      throw new Error(`ClientProxy for service ${serviceName} not found`);
    }
    return client;
  }

  /**
   * Send an event dynamically using the service name.
   * @param serviceName The name of the service to send the event to.
   * @param pattern The event pattern.
   * @param data The payload data.
   */
  async sendEvent<T>(
    serviceName: string,
    pattern: string,
    data: T,
  ): Promise<void> {
    try {
      const client = this.getClient(serviceName);
      return client.emit(pattern, data).toPromise();
    } catch (error) {
      this.logger.error(
        `Failed to send event to ${serviceName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Send an event and wait for a response.
   * @param serviceName
   * @param pattern
   * @param data
   * @returns
   */
  async sendEventWithResponse<T, R>(
    serviceName: string,
    pattern: string,
    data: T,
  ): Promise<R> {
    try {
      const client = this.getClient(serviceName);
      return lastValueFrom(client.send<R>(pattern, data));
    } catch (error) {
      this.logger.error(
        `Failed to send event to ${serviceName}: ${error.message}`,
      );
      throw error;
    }
  }
}
