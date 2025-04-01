import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rabbitmq.service';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TracingInterceptor } from '../interceptors/tracing.interceptor';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
                queueOptions: {
                  durable: false,
                  ttl: 6 * 60 * 60 * 1000,
                },
                persistent: true,
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      // providers: [
      //   {
      //     provide: APP_INTERCEPTOR,
      //     useClass: TracingInterceptor,
      //   },
      // ],
      exports: [ClientsModule],
    };
  }
}
