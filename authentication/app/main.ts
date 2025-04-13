import './common/apm';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

import { RmqService } from './common/rmq/rabbitmq.service';
import { SERVICES } from './utils/constants';
import { TracingInterceptor } from './common/interceptors/tracing.interceptor';
import { generateApiCode } from './utils/generate.code';
import { generateRtkApiCode } from 'utils/generate.rtk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const serviceName = configService.getOrThrow('SERVICE_NAME');
  const serviceUrl = configService.getOrThrow('SERVICE_URL');
  const version = configService.getOrThrow('VERSION');

  const PORT: number = Number(configService.getOrThrow<number>('PORT')) || 4001;

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new TracingInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  if (process.env?.NODE_ENV === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(serviceName)
      .setDescription(`${serviceName} API Description`)
      .setVersion(version)
      .setExternalDoc('More Information', '')
      .addServer(serviceUrl)
      .addBearerAuth()
      .build();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const document: any = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);

    const publicPath = join(__dirname, './public');

    if (!existsSync(publicPath)) {
      mkdirSync(publicPath, { recursive: true });
    }

    await writeFileSync(
      join(publicPath, 'swagger.json'),
      JSON.stringify(document, null, 2),
    );
    // this will generate api request for ui with axios from swagger json.
    const apiGenerationPath = join(__dirname, '../../ui/api');
    console.log(apiGenerationPath);

    if (!apiGenerationPath) {
      mkdirSync(apiGenerationPath, { recursive: true });
    }

    const code = await generateApiCode(document);
    const apiCode = await generateRtkApiCode(document);

    await writeFileSync(join(apiGenerationPath, 'index.ts'), code, 'utf-8');
    await writeFileSync(join(apiGenerationPath, 'api.ts'), apiCode, 'utf-8');

    NestLogger.log('API code generated successfully', 'Bootstrap');
  }

  const rmqService = app.get<RmqService>(RmqService);
  Object.values(SERVICES).forEach((service) => {
    app.connectMicroservice(rmqService.getOptions(service));
  });

  await app.startAllMicroservices();
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
