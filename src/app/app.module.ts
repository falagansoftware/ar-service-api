import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import {
  AXIOS_HTTP_MAX_REDIRECTS,
  AXIOS_HTTP_TIMEOUT,
  DATABASE_POSTGRES_HOST,
  DATABASE_POSTGRES_NAME,
  DATABASE_POSTGRES_PASS,
  DATABASE_POSTGRES_PORT,
  DATABASE_POSTGRES_SSL,
  DATABASE_POSTGRES_USERNAME,
  NODE_ENV,
  NODE_ENV_PROD,
  USER_PASS_HASH_CONFIG,
  USER_PASS_HASH_SALT,
} from './config/constants';
import { WinstonModule } from 'nest-winston';
import { HttpModule } from '@nestjs/axios';
import * as winston from 'winston';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { _EncryptModule } from './shared/lib-tools';
import { AuthController } from './modules/auth/controllers/auth.controller';
import { _AuthModule } from './shared/lib-auth/auth.module';
import { AuthStrategy } from './shared/lib-auth/auth.module.models';
import { UsersService } from './modules/users/services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
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
    _EncryptModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        hashConfigurations: [
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
        type: 'postgres',
        host: configService.get(DATABASE_POSTGRES_HOST),
        port: +configService.get(DATABASE_POSTGRES_PORT),
        username: configService.get(DATABASE_POSTGRES_USERNAME),
        password: configService.get(DATABASE_POSTGRES_PASS),
        ssl: configService.get(DATABASE_POSTGRES_SSL),
        autoLoadEntities: true,
        synchronize: configService.get(NODE_ENV) !== NODE_ENV_PROD,
        logging: ['error', 'warn', 'info', 'log', 'query', 'schema'],
        database: configService.get(DATABASE_POSTGRES_NAME),
      }),
    }),
    _AuthModule.registerAsync({
      imports: [ConfigModule, UsersModule],
      inject: [UsersService],
      useFactory: (usersService: UsersService) => ({
        type: AuthStrategy.BASIC,
        config: { basic: { usersService } },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [],
  exports: [HttpModule],
})
export class AppModule {}
