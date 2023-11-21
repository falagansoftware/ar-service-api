import { Request } from '@nestjs/common';
import { IsEmail, Length } from 'class-validator';

export class SignInInput {
  username: string;
  password: string;
}

export class SignUpInput {
  @Length(3, 20)
  name: string;
  @Length(3, 20)
  surname: string;
  @IsEmail()
  email: string;
  @Length(3, 20)
  password: string;
}

export interface RefreshTokenInput extends Request {
  user: {
    sub: string;
    refreshToken: string;
  };
}
