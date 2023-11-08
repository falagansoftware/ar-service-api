import { Request } from '@nestjs/common';

export class SignInInput {
  username: string;
  password: string;
}

export class SignUpInput {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface RefreshTokenInput extends Request {
  user: {
    sub: string;
    refreshToken: string;
  };
}
