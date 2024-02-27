import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload, RefreshTokenPayload } from './tokens.models';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Strategy as LocalPassportStrategy } from 'passport-local';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_HEADER_NAME, REFRESH_TOKEN_SECRET } from '../constants';
import { _AuthService } from '../../../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ACCESS_TOKEN_SECRET),
    });
  }

  async validate(payload: AccessTokenPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalPassportStrategy) {
  constructor(private readonly authService: _AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser(username, password);
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, REFRESH_TOKEN_HEADER_NAME) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
