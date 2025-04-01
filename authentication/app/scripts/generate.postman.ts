import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Collection, Item } from 'postman-collection';
import { AppModule } from '../modules/app.module';
import { writeFileSync } from 'fs';
import { exit } from 'process';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('ENV', process?.env);
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const postmanCollection = new Collection({
    info: {
      name: 'You App',
      version: '1.0.1',
    },
    item: [],
    variable: [
      {
        key: 'baseUrl',
        value: 'http://localhost:4001',
        type: 'string',
      },
    ],
  });

  const paths = Object.keys(document?.paths ?? {});
  let pathIndex = 0;
  let methodIndex = 0;

  while (pathIndex < paths.length) {
    const path = paths[pathIndex];
    const methods = Object.keys(document.paths[path]);

    if (methodIndex < methods.length) {
      const method = methods[methodIndex];
      const route = document.paths[path][method];
      const item = new Item({
        name: `${method.toUpperCase()} ${path}`,
        request: {
          method: method.toUpperCase(),
          header: [
            {
              key: 'Authorization', // authorization token
              value: '',
              description: 'Bearer Token',
            },
          ],
          url: `{{baseUrl}}${path}`,
          description: route.summary,
        },
      });
      postmanCollection.items.add(item);
      methodIndex++;
    } else {
      methodIndex = 0;
      pathIndex++;
    }
  }

  await writeFileSync(
    'postman_collection.json',
    JSON.stringify(postmanCollection.toJSON(), null, 2),
  );
  exit(1);
}

(async (): Promise<void> => {
  try {
    await bootstrap();
  } catch (error) {
    /* empty */
  }
})();
