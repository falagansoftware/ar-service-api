import { DynamicModule, Module } from '@nestjs/common';
import { _AuthService } from './auth.service';
import { AuthAsyncModuleOptions, AuthModuleOptions } from './auth.module.models';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BasicAuthService } from './strategies/basic-auth/basic-auth.service';
import { TokensService } from './strategies/basic-auth/tokens/tokens.service';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './strategies/basic-auth/tokens/tokens.strategies';

@Module({})
export class _AuthModule {
  static register(options: AuthModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: _AuthModule,
      providers: [
        {
          provide: 'AUTH_OPTIONS',
          useValue: options,
        },
        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        TokensService,
        BasicAuthService,
        _AuthService,
      ],
      imports: [PassportModule, JwtModule],
      exports: [_AuthService],
    };
  }

  static registerAsync(options: AuthAsyncModuleOptions): DynamicModule {
    return {
      global: options.global || false,
      module: _AuthModule,
      imports: [...options.imports, PassportModule, JwtModule],
      providers: [
        {
          provide: 'AUTH_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        LocalStrategy,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        TokensService,
        BasicAuthService,
        _AuthService,
      ],
      exports: [_AuthService],
    };
  }
}
