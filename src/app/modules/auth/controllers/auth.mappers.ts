import { Expose } from 'class-transformer';

export class SignInMapper {
  @Expose()
  username: string;
  @Expose()
  password: string;
}
