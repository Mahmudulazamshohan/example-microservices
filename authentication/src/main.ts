import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT: number = Number(configService.getOrThrow<number>('PORT')) || 4001;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Authentication Service')
    .setDescription('Authentication API Swagger')
    .setVersion('1.0')
    .setExternalDoc('More Information', 'https://www.google.com')
    .addServer('http://localhost/api/authentication')
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
