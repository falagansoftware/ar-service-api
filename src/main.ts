import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GLOBAL_PREFIX, NODE_ENV, NODE_ENV_PROD, SERVER_PORT } from './app/config/constants';
import { swaggerConfig } from './app/config/swagger.config';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get(SERVER_PORT);
  const environment = app.get(ConfigService).get(NODE_ENV);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors();

  if (environment !== NODE_ENV_PROD) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${GLOBAL_PREFIX}/doc`, app, document);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
}

bootstrap();
