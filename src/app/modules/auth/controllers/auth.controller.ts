import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth/auth.service';
import { SignIn, SignUp } from '../services/auth/auth.models';
import { SignInMapper, SignUpMapper } from './auth.mappers';
import { RefreshTokenOutput, SignInOutput } from './auth.outputs.dto';
import { RefreshTokenInput, SignInInput, SignUpInput } from './auth.inputs.dto';
import { RefreshTokenAuthGuard } from '../services/tokens/tokens.guards';
import { AppError } from 'src/app/shared/lib-errors';
import { Serializer } from 'src/app/shared/lib-tools';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInInput: SignInInput): Promise<SignInOutput> {
    const signIn: SignIn = Serializer.item(signInInput, SignInMapper);
    const response = await this.authService.singIn(signIn);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    } else {
      return Serializer.item(response, SignInOutput);
    }
  }

  @Post('sign-up')
  async signUp(@Body() signUpInput: SignUpInput): Promise<SignInOutput> {
    const signUp: SignUp = Serializer.item(signUpInput, SignUpMapper);
    const response = await this.authService.singUp(signUp);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.UNAUTHORIZED);
    } else {
      return Serializer.item(response, SignInOutput);
    }
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('refresh')
  async refresh(@Req() refreshTokenInput: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const response = await this.authService.sessionRefresh(refreshTokenInput);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      return Serializer.item(response, RefreshTokenOutput);
    }
  }
}
