import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/services/users.service';
import { TokensService } from '../tokens/tokens.service';
import { USER_NOT_FOUND, USER_UNAUTHORISED } from '../../../../config/errors-dictionary';
import { REFRESH_TOKEN_SECRET, USER_PASS_HASH_CONFIG } from '../../../../config/constants';
import { RefreshCredentials, RefreshToken, SignIn, SignInCredentials } from './auth.models';
import { AppError } from 'src/app/shared/lib-errors';
import { EncryptService } from 'src/app/shared/lib-tools';

@Injectable()
export class AuthService {
  constructor(
    private tokensService: TokensService,
    private encryptService: EncryptService,
    private usersService: UsersService,
  ) {}

  async singIn(signIn: SignIn): Promise<SignInCredentials | AppError> {
    const user = await this.usersService.findBy({ email: signIn.username });
    if (user instanceof AppError) {
      return new AppError(USER_NOT_FOUND);
    } else {
      const userPassMatch = await this.encryptService.compare(USER_PASS_HASH_CONFIG, signIn.password, user.password);
      if (!userPassMatch) {
        return new AppError(USER_UNAUTHORISED);
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

  async sessionRefresh(refreshToken: RefreshToken): Promise<RefreshCredentials | AppError> {
    const user = await this.usersService.findBy({ uid: refreshToken.user.sub });
    const token = refreshToken.user.refreshToken;
    if (user instanceof AppError || !token) {
      return new AppError(USER_UNAUTHORISED);
    }
    const validToken = await this.tokensService.verify(token, REFRESH_TOKEN_SECRET);
    if (!validToken) {
      return new AppError(USER_UNAUTHORISED);
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

  async validateUser(username: string, password: string): Promise<any | AppError> {
    const user = await this.usersService.findBy({ email: username });
    if (user instanceof AppError) {
      return new AppError(USER_NOT_FOUND);
    } else {
      const userPassMatch = await this.encryptService.compare(USER_PASS_HASH_CONFIG, password, user.password);
      if (!userPassMatch) {
        return new AppError(USER_UNAUTHORISED);
      } else {
        const { password, ...result } = user;
        return result;
      }
    }
  }
}
