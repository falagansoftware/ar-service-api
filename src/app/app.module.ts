import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import {
  AXIOS_HTTP_MAX_REDIRECTS,
  AXIOS_HTTP_TIMEOUT,
  DATABASE_MSSQL_HOST,
  DATABASE_MSSQL_NAME,
  DATABASE_MSSQL_PASS,
  DATABASE_MSSQL_PORT,
  DATABASE_MSSQL_USERNAME,
  NODE_ENV,
  NODE_ENV_PROD,
  USER_ID_HASH_CONFIG,
  USER_ID_HASH_SALT,
  USER_PASS_HASH_CONFIG,
  USER_PASS_HASH_SALT,
} from './config/constants';
import { WinstonModule } from 'nest-winston';
import { HttpModule } from '@nestjs/axios';
import * as winston from 'winston';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptModule } from './shared/lib-tools';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    HealthCheckModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get(AXIOS_HTTP_TIMEOUT),
        maxRedirects: configService.get(AXIOS_HTTP_MAX_REDIRECTS),
      }),
      inject: [ConfigService],
    }),
    EncryptModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        hashConfigurations: [
          {
            name: USER_ID_HASH_CONFIG,
            salt: configService.get(USER_ID_HASH_SALT),
          },
          {
            name: USER_PASS_HASH_CONFIG,
            salt: configService.get(USER_PASS_HASH_SALT),
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(DATABASE_MSSQL_HOST),
        port: +configService.get(DATABASE_MSSQL_PORT),
        username: configService.get(DATABASE_MSSQL_USERNAME),
        password: configService.get(DATABASE_MSSQL_PASS),
        autoLoadEntities: true,
        synchronize: configService.get(NODE_ENV) !== NODE_ENV_PROD,
        logging: ['error', 'warn', 'info', 'log', 'query', 'schema'],
        database: configService.get(DATABASE_MSSQL_NAME),
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
  exports: [HttpModule],
})
export class AppModule {}
