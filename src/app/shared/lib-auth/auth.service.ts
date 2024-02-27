import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import {
  AuthModuleOptions,
  SignIn,
  SignUpCredentials,
  SignUp,
  SignInCredentials,
  RefreshCredentials,
  RefreshToken,
  AuthStrategy,
  AuthStrategyService,
} from './auth.module.models';
import { AppError } from '../lib-errors';
import { BasicAuthService } from './strategies/basic-auth/basic-auth.service';

@Injectable()
export class _AuthService {
  private logger: Logger;
  private auth: AuthStrategyService;

  constructor(
    @Inject('AUTH_OPTIONS') private options: AuthModuleOptions,
    @Optional() private basicAuthService: BasicAuthService,
  ) {
    this.initModule(options);
  }

  public async signIn(signIn: SignIn): Promise<SignInCredentials | AppError> {
    return await this.auth.signIn(signIn);
  }

  public async signUp(signUp: SignUp): Promise<SignUpCredentials | AppError> {
    return await this.auth.signUp(signUp);
  }

  public async validateUser(username: string, password: string): Promise<boolean | AppError> {
    return await this.auth.validateUser(username, password);
  }

  public async refreshSession(refreshToken: RefreshToken): Promise<RefreshCredentials | AppError> {
    return await this.auth.refreshSession(refreshToken);
  }

  private initModule(options: AuthModuleOptions) {
    this.logger = new Logger();
    this.setAuthStrategy(options);
  }

  private setAuthStrategy(options: AuthModuleOptions) {
    switch (options.type) {
      case AuthStrategy.BASIC:
        this.auth = this.basicAuthService;
        this.logger.log('Auth Module initialized; Strategy Basic', 'Auth MOdule');
        break;

      case AuthStrategy.FIREBASE:
        this.logger.log('Auth Module initialized; Strategy Firebase', 'Auth MOdule');
        break;

      case AuthStrategy.CUSTOM:
        this.auth = new this.options.config.custom.service();
        this.logger.log('Auth Module initialized; Strategy Custom', 'Auth MOdule');

      default:
        break;
    }
  }
}
