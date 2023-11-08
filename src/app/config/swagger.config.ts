import { DocumentBuilder } from '@nestjs/swagger';
import { ACCESS_TOKEN_HEADER_NAME } from './constants';

const environment = process.env['NODE' + '_ENV'];

export const swaggerConfig = new DocumentBuilder()
  .setTitle(`API AUTO-REPAIR - ${environment}`)
  .setDescription('Swagger for the Auto-Repair App API')
  .setVersion('1.0')
  .addTag('Eloy Pérez')
  .addApiKey(
    {
      in: 'header',
      type: 'apiKey',
      description: 'Access token',
    },
    ACCESS_TOKEN_HEADER_NAME,
  )
  .build();
