import { Expose } from 'class-transformer';

export class CreateUserMapper {
  @Expose()
  name: string;
  @Expose()
  surname: string;
  @Expose()
  email: string;
  @Expose()
  password: string;
}

export class UpdateUserMapper {
  @Expose()
  name: string;
  @Expose()
  surname: string;
}

export class UserIdMapper {
  @Expose()
  uid: string;
}
