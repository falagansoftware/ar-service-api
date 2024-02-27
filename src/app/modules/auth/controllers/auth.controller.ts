import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInMapper, SignUpMapper } from './auth.mappers';
import { RefreshTokenOutput, SignInOutput } from './auth.outputs.dto';
import { RefreshTokenInput, SignInInput, SignUpInput } from './auth.inputs.dto';
import { AppError } from 'src/app/shared/lib-errors';
import { Serializer } from 'src/app/shared/lib-tools';
import { _AuthService } from 'src/app/shared/lib-auth/auth.service';
import { SignIn, SignUp } from 'src/app/shared/lib-auth/auth.module.models';
import { RefreshTokenAuthGuard } from 'src/app/shared/lib-auth/strategies/basic-auth/tokens/tokens.guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: _AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInInput: SignInInput): Promise<SignInOutput> {
    const signIn: SignIn = Serializer.item(signInInput, SignInMapper);
    const response = await this.authService.signIn(signIn);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    } else {
      return Serializer.item(response, SignInOutput);
    }
  }

  @Post('sign-up')
  async signUp(@Body() signUpInput: SignUpInput): Promise<SignInOutput> {
    const signUp: SignUp = Serializer.item(signUpInput, SignUpMapper);
    const response = await this.authService.signUp(signUp);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    } else {
      return Serializer.item(response, SignInOutput);
    }
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh')
  async refresh(@Req() refreshTokenInput: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const response = await this.authService.refreshSession(refreshTokenInput);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      return Serializer.item(response, RefreshTokenOutput);
    }
  }
}
