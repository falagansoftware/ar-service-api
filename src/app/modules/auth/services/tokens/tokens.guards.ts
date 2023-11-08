import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN_HEADER_NAME, REFRESH_TOKEN_HEADER_NAME } from '../../../../config/constants';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_TOKEN_HEADER_NAME) {}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(REFRESH_TOKEN_HEADER_NAME) {}
