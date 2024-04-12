import {
  EntityNotFoundError,
  Like,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { HashHelper } from '../hash/hash.helper';
import { TUser } from '../common/types';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate } from 'class-validator';

type TWhereArgs = {
  id?: string;
  username?: string;
  email?: string;
};

type TSelectOptions = {
  noEmail?: boolean;
  noPassword?: boolean;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashHelper: HashHelper,
  ) {}

  private async isValueExist({
    username,
    email,
  }: TWhereArgs): Promise<boolean> {
    return await this.usersRepository.exists({
      where: [{ username }, { email }],
    });
  }

  async findOneBy(
    { id, username }: TWhereArgs,
    { noEmail = false, noPassword = false }: TSelectOptions,
  ): Promise<TUser> {
    try {
      const user: TUser = await this.usersRepository.findOneOrFail({
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
          email: noEmail ? false : true,
          password: noPassword ? false : true,
        },
        where: [{ id }, { username }],
      });
      return user;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Пользователь не найден');
      }
    }
  }

  async create(dto: CreateUserDto): Promise<TUser> {
    const isUsernameExist = await this.isValueExist({
      username: dto.username,
    });
    const isEmailExist = await this.isValueExist({
      email: dto.email,
    });

    if (isUsernameExist) {
      throw new BadRequestException(
        `Имя пользователя ${dto.username} уже занято. Выберите другое имя пользователя`,
      );
    }
    if (isEmailExist) {
      throw new BadRequestException(
        `Пользователь с адресом электронной почты ${dto.email} уже зарегистрирован`,
      );
    }

    const userInstance = this.usersRepository.create(dto);
    const errors = await validate(userInstance);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    try {
      const { password, wishes, offers, wishlists, ...user } =
        await this.usersRepository.save(userInstance);
      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if (error.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async findMany(query: string): Promise<TUser[]> {
    try {
      return await this.usersRepository.find({
        select: {
          id: true,
          username: true,
          about: true,
          avatar: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
        where: [
          { username: Like(`%${query}%`) },
          { email: Like(`%${query}%`) },
        ],
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Не найдено ни одного соответствия');
      }
    }
  }

  async updateOne(id: string, dto: UpdateUserDto): Promise<TUser> {
    const user = await this.findOneBy({ id }, {});

    if (dto.username && dto.username !== user.username) {
      const isUsernameExist = await this.isValueExist({
        username: dto.username,
      });
      if (isUsernameExist)
        throw new BadRequestException(
          `Имя пользователя ${dto.username} уже занято. Выберите другое имя пользователя`,
        );
    }

    if (dto.email && dto.email !== user.email) {
      const isEmailExist = await this.isValueExist({
        email: dto.email,
      });
      if (isEmailExist)
        throw new BadRequestException(
          `Пользователь с адресом электронной почты ${dto.email} уже зарегистрирован`,
        );
    }

    if (dto.password) {
      dto.password = await this.hashHelper.getHash(dto.password);
    }

    await this.usersRepository.update(id, dto);
    const updatedUser = this.findOneBy({ id }, { noPassword: true });
    return updatedUser;
  }
}
