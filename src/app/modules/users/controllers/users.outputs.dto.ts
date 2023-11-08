import { Expose } from 'class-transformer';

export class CreateUserOutput {
  @Expose()
  uid: string;
  @Expose()
  name: string;
  @Expose()
  surname: string;
  @Expose()
  email: string;
}

export class ItemUserOutput {
  @Expose()
  uid: string;
  @Expose()
  name: string;
  @Expose()
  surname: string;
  @Expose()
  email: string;
}

export class UpdateUserOutput {
  @Expose()
  uid: string;
  @Expose()
  name: string;
  @Expose()
  surname: string;
}
