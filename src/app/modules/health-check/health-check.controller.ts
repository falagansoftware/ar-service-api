import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GLOBAL_PREFIX } from '../../config/constants';

@ApiTags('Health')
@Controller('health')
export class HealthCheckController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('alive')
  @HealthCheck()
  checkApiAlive() {
    // this.logger.log('test');
    // throw new HttpException(ERRORS_DICTIONARY.EXAMPLE, HttpStatus.BAD_GATEWAY);
    // throw new AppError(ERRORS_DICTIONARY.EXAMPLE);
    return GLOBAL_PREFIX + ' is alive!';
  }

  // @Get()
  // @HealthCheck()
  // check() {
  //   return this.healthCheckService.check([
  //     () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
  //   ]);
  // }
}
