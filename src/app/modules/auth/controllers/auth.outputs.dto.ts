import { Expose } from 'class-transformer';
import { CreateUserOutput } from '../../users/controllers/users.outputs.dto';

export class SignInOutput {
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
}

export class RefreshTokenOutput extends SignInOutput {}

export class SignUpOutput {
  accessToken: string;
  refreshToken: string;
  user: CreateUserOutput;
}
