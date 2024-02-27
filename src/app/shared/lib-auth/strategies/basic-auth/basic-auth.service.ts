import { Inject, Injectable } from '@nestjs/common';
import {
  SERVER_ERROR,
  USER_EXISTS,
  USER_NOT_CREATED,
  USER_NOT_FOUND,
  USER_UNAUTHORIZED,
} from '../../../../config/errors-dictionary';
import { AppError } from 'src/app/shared/lib-errors';
import { _EncryptService } from 'src/app/shared/lib-tools';
import { User } from 'src/app/modules/users/services/users.models';
import { TokensService } from './tokens/tokens.service';
import {
  AuthModuleOptions,
  AuthStrategyService,
  BasicAuthUsersService,
  RefreshCredentials,
  RefreshToken,
  SignIn,
  SignInCredentials,
  SignUp,
  SignUpCredentials,
} from '../../auth.module.models';
import { REFRESH_TOKEN_SECRET } from './constants';
import { USER_PASS_HASH_CONFIG } from 'src/app/config/constants';

@Injectable({})
export class BasicAuthService implements AuthStrategyService {
  private usersService: BasicAuthUsersService;
  constructor(
    @Inject('AUTH_OPTIONS') private options: AuthModuleOptions,
    private tokensService: TokensService,
    private encryptService: _EncryptService,
  ) {
    this.usersService = options.config.basic.usersService;
  }

  async signIn(signIn: SignIn): Promise<SignInCredentials | AppError> {
    const user = await this.usersService.findBy({ email: signIn.username });
    if (user instanceof AppError) {
      return new AppError(USER_NOT_FOUND);
    } else {
      const userPassMatch = await this.encryptService.compare(USER_PASS_HASH_CONFIG, signIn.password, user.password);
      if (!userPassMatch) {
        return new AppError(USER_UNAUTHORIZED);
      } else {
        const accessToken = await this.tokensService.getAccessToken({
          username: user.email,
          sub: user.uid,
        });
        const refreshToken = await this.tokensService.getRefreshToken({
          username: user.email,
          sub: user.uid,
        });
        return {
          accessToken,
          refreshToken,
        };
      }
    }
  }

  async signUp(signUp: SignUp): Promise<SignUpCredentials | AppError> {
    const user = await this.usersService.findBy({ email: signUp.email });
    if (user instanceof User) {
      return new AppError(USER_EXISTS);
    } else {
      const userPassEncrypted = await this.encryptService.hash(USER_PASS_HASH_CONFIG, signUp.password);
      if (!userPassEncrypted) {
        return new AppError(SERVER_ERROR);
      } else {
        const userCreated = await this.usersService.create({ ...signUp, password: userPassEncrypted });
        if (userCreated instanceof AppError) {
          return new AppError(USER_NOT_CREATED);
        } else {
          const accessToken = await this.tokensService.getAccessToken({
            username: userCreated.email,
            sub: userCreated.uid,
          });
          const refreshToken = await this.tokensService.getRefreshToken({
            username: userCreated.email,
            sub: userCreated.uid,
          });
          return {
            accessToken,
            refreshToken,
          };
        }
      }
    }
  }

  async refreshSession(refreshToken: RefreshToken): Promise<RefreshCredentials | AppError> {
    const user = await this.usersService.findBy({ uid: refreshToken.user.sub });
    const token = refreshToken.user.refreshToken;
    if (user instanceof AppError || !token) {
      return new AppError(USER_UNAUTHORIZED);
    }
    const validToken = await this.tokensService.verify(token, REFRESH_TOKEN_SECRET);
    if (!validToken) {
      return new AppError(USER_UNAUTHORIZED);
    }
    const newAccessToken = await this.tokensService.getAccessToken({
      username: user.email,
      sub: user.uid,
    });
    const newRefreshToken = await this.tokensService.getRefreshToken({
      username: user.email,
      sub: user.uid,
    });
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateUser(username: string, password: string): Promise<boolean | AppError> {
    const user = await this.usersService.findBy({ email: username });
    if (user instanceof AppError) {
      return new AppError(USER_NOT_FOUND);
    } else {
      const userPassMatch = await this.encryptService.compare(USER_PASS_HASH_CONFIG, password, user.password);
      if (!userPassMatch) {
        return new AppError(USER_UNAUTHORIZED);
      } else {
        return userPassMatch;
      }
    }
  }
}
