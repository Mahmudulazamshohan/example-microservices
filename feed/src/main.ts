import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Logger as NestLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT: number = Number(configService.getOrThrow<number>('PORT')) || 4002;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(PORT, () => NestLogger.log(`Server Port at ${PORT}`));
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();
