import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER_NOT_CREATED, USER_NOT_DELETED, USER_NOT_FOUND } from '../../../config/errors-dictionary';
import { FindOutput } from '../../../shared/shared.models';
import { CreateUser, FindUsers, UpdateUser, User } from './users.models';
import { UserEntity } from './users.entities';
import { setFindQuery } from '../../../shared/typeorm.utils';
import { AppError } from 'src/app/shared/lib-errors';
import { Serializer } from 'src/app/shared/lib-tools';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUser: CreateUser): Promise<User | AppError> {
    try {
      return this.usersRepository.save(createUser);
    } catch (error) {
      return new AppError(USER_NOT_CREATED);
    }
  }

  async find(criteria: FindUsers<User>): Promise<FindOutput<User>> {
    const findQuery = setFindQuery<User>(criteria);
    const [users, count] = await this.usersRepository.findAndCount(findQuery);
    const usersFound: User[] = Serializer.collection(users, User);

    return {
      result: usersFound,
      total: count,
    };
  }

  async findBy(criteria: { [key: string]: any }): Promise<User | AppError> {
    const user = await this.usersRepository.findOneBy(criteria);
    if (!user) {
      return new AppError(USER_NOT_FOUND);
    }
    const userFound: User = Serializer.item(user, User);
    return userFound;
  }

  async update(uid: string, updateUser: UpdateUser): Promise<User | AppError> {
    const existingUser = await this.usersRepository.findOneBy({ uid });
    if (!existingUser) {
      return new AppError(USER_NOT_FOUND);
    }
    this.usersRepository.merge(existingUser, updateUser);
    const userUpdated = await this.usersRepository.save(existingUser);
    const user: User = Serializer.item(userUpdated, User);
    return user;
  }

  async remove(userId: string): Promise<User> {
    const deleted = await this.usersRepository.delete(userId);
    if (deleted.affected === 0) {
      throw new AppError(USER_NOT_DELETED);
    }
    const deletedUser: User = Serializer.item(deleted.raw, User);
    return deletedUser;
  }
}
