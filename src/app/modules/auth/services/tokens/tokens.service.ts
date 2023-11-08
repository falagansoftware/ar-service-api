import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
} from '../../../../config/constants';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService, private configService: ConfigService) {}

  public async getAccessToken(payload: { username: string; sub: string }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get(ACCESS_TOKEN_SECRET),
      expiresIn: this.configService.get(ACCESS_TOKEN_EXPIRATION_TIME),
    });
  }

  public async getRefreshToken(payload: { username: string; sub: string }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get(REFRESH_TOKEN_SECRET),
      expiresIn: this.configService.get(REFRESH_TOKEN_EXPIRATION_TIME),
    });
  }

  public verify(token: string, secretKey: string) {
    const secret = this.configService.get(secretKey);
    return this.jwtService.verify(token, {
      secret,
    });
  }

  public decodeToken(token: string): any {
    const decoded = this.jwtService.decode(token, { json: true });
    if (typeof decoded !== 'string') {
      return decoded;
    }
  }
}
