import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { FindInput, FindMapper, SortOrder } from '../../../shared/shared.models';
import { CreateUserInput, FilterUserInput, UpdateUserInput, UserIdInput } from './users.inputs.dto';
import { CreateUserMapper, UpdateUserMapper, UserIdMapper } from './users.mappers';
import { CreateUserOutput, ItemUserOutput, UpdateUserOutput } from './users.outputs.dto';
import { CreateUser, FindUsers, UpdateUser, User, UserId } from '../services/users.models';
import { AppError } from 'src/app/shared/lib-errors';
import { Serializer } from 'src/app/shared/lib-tools';
import { AccessTokenAuthGuard } from 'src/app/shared/lib-auth/strategies/basic-auth/tokens/tokens.guards';
@ApiTags('Users')
@UseGuards(AccessTokenAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Req() req: Request, @Body() createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    const createUser: CreateUser = Serializer.item(createUserInput, CreateUserMapper);

    const response: User | AppError = await this.usersService.create(createUser);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return Serializer.item(response, CreateUserOutput);
  }

  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: String })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: 'object',
    examples: {
      'simple filter': { description: 'Simple filter', value: { name: 'ELoy' } },
      'complex filter': { description: 'Complex filter', value: { name: 'Eloy, string', surname: 'string' } },
    },
  })
  @Get('find')
  async find(@Query() query: FindInput<FilterUserInput>) {
    const criteria: FindUsers<User> = Serializer.item(query, FindMapper, false);
    const response = await this.usersService.find(criteria);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const users: ItemUserOutput[] = Serializer.collection(response.result, ItemUserOutput);
    return {
      result: users,
      total: response.total,
    };
  }

  @Get(':uid')
  async findOne(@Param() params: UserIdInput): Promise<ItemUserOutput> {
    const findOne: UserId = Serializer.item(params, UserIdMapper);

    const response: User | AppError = await this.usersService.findBy({ uid: findOne.uid });
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    return Serializer.item(response, ItemUserOutput);
  }

  @Patch(':uid')
  async update(@Param() params: UserIdInput, @Body() updateUserInput: UpdateUserInput): Promise<UpdateUserOutput> {
    const updateUser: UpdateUser = Serializer.item(updateUserInput, UpdateUserMapper);
    const updateOne: UserId = Serializer.item(params, UserIdMapper);

    const response: User | AppError = await this.usersService.update(updateOne.uid, updateUser);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    return Serializer.item(response, ItemUserOutput);
  }

  @Delete(':uid')
  async remove(@Param() params: UserIdInput): Promise<ItemUserOutput> {
    const removeOne: UserId = Serializer.item(params, UserIdMapper);

    const response: User | AppError = await this.usersService.remove(removeOne.uid);
    if (response instanceof AppError) {
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }
    return Serializer.item(response, ItemUserOutput);
  }
}
