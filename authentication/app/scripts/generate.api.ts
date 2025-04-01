// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AppModule } from '../modules/app.module';
// import { NestFactory } from '@nestjs/core';
// import { generateApiCode } from '../utils/generateApiCode';
// import { writeFileSync } from 'fs';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const config = new DocumentBuilder()
//     .setTitle('Authentication API')
//     .setDescription('The API description')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   const apiCode = await generateApiCode(document, 'axiosInstance');
//   await writeFileSync(
//     join(__dirname, '../src/components/api', 'generatedApi.ts'),
//     apiCode,
//   );
//   process.exit(1);
// }

// (async (): Promise<void> => {
//   try {
//     await bootstrap();
//   } catch (error) {
//     /* empty */
//   }
// })();
export default {};
