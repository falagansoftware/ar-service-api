import { Expose } from 'class-transformer';

export class SignInMapper {
  @Expose()
  username: string;
  @Expose()
  password: string;
}

export class SignUpMapper {
  @Expose()
  name: string;
  @Expose()
  surname: string;
  @Expose()
  email: string;
  @Expose()
  password: string;
}
