import './common/apm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Logger as NestLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { TracingInterceptor } from '@common/interceptors/tracing.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT: number = Number(configService.getOrThrow<number>('PORT')) || 4002;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new TracingInterceptor(),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Feed Service')
    .setDescription('Feed API Description')
    .setVersion('1.0')
    .setExternalDoc('More Information', 'https://www.google.com')
    .addServer('http://localhost/api/feed')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerPath = join(__dirname, './public');

  if (!existsSync(swaggerPath)) {
    mkdirSync(swaggerPath, { recursive: true });
  }

  await writeFileSync(
    join(swaggerPath, 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('api-docs', app, document);

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
