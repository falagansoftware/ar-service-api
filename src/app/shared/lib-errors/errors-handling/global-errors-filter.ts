import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import 'dotenv/config';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppError } from './app-error';
interface GlobalErrorResponse {
  status: HttpStatus;
  timestamp: string;
  path: string;
  method: string;
  error?: number;
  message?: string;
  correlationId: string;
}

@Catch()
export class GlobalErrorsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
  catch(exception: HttpException | AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status: HttpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? (exception.getResponse() as { message: string }).message : exception.message;

    const error =
      exception instanceof HttpException ? (exception.getResponse() as { error: number }).error : exception.error;

    const errorBodyResponse: GlobalErrorResponse = {
      status,
      timestamp: new Date().toISOString(),
      correlationId: response.getHeaders()['x-correlation-id'] as string,
      path: request.url,
      method: request.method,
      message,
      error,
    };

    if (status >= 500) {
      this.logger.error(
        JSON.stringify(errorBodyResponse),
        `Request method: ${request.method} Request url${request.url}`,
      );
    }
    if (status >= 400 && status < 500) {
      this.logger.warn(
        JSON.stringify(errorBodyResponse),
        `Request method: ${request.method} Request url${request.url}`,
      );
    }
    if (status < 400) {
      this.logger.log(JSON.stringify(errorBodyResponse), `Request method: ${request.method} Request url${request.url}`);
    }
    response.status(status).json(errorBodyResponse);
  }
}
