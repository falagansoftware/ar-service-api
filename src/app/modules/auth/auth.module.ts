import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth/auth.service';

import { TokensService } from './services/tokens/tokens.service';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy } from './services/tokens/tokens.strategies';

@Module({
  controllers: [AuthController],
  imports: [HttpModule, PassportModule, JwtModule, UsersModule],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy, TokensService],
})
export class AuthModule {}
