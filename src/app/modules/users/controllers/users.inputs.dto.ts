import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserInput {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class UpdateUserInput extends PartialType(CreateUserInput) {}

export class UserIdInput {
  @IsString()
  uid: string;
}

export class FilterUserInput {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  email: string;
}
