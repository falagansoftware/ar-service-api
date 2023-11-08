import { PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateUser {
  name: string;
  surname: string;
  password: string;
  email: string;
}

export class FindOneUser {
  uid: string;
}

export class FindUsers<F> {
  offset: string;
  limit: string;
  sortBy: string;
  sortOrder: string;
  filters: Partial<F>[];
}

export class UpdateUser extends PartialType(CreateUser) {}

export class User {
  @Expose()
  public uid: string;
  @Expose()
  public name: string;
  @Expose()
  public surname: string;
  @Expose()
  public email: string;
  @Expose()
  public password: string;
}

export class UserId {
  uid: string;
}

enum USER_LANGUAGES {
  EN = 'en',
}

export interface UserPreferences {
  language: USER_LANGUAGES;
  theme: string;
}
