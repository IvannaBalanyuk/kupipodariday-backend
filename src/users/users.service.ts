import { BadRequestException, Injectable } from '@nestjs/common';

import { CommonMethods } from '../utils/common-methods';
import { HashHelper } from '../hash/hash.helper';
import { TFindUserByArgs, TUserBase, TWishFull } from '../utils/types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashHelper: HashHelper,
  ) {}

  async createUser(dto: CreateUserDto): Promise<TUserBase> {
    if (dto.username) {
      const isUsernameExist = await this.usersRepository.isUserExist({
        username: dto.username,
      });

      if (isUsernameExist) {
        throw new BadRequestException(
          `Имя пользователя ${dto.username} уже занято. Выберите другое имя пользователя`,
        );
      }
    }

    if (dto.email) {
      const isEmailExist = await this.usersRepository.isUserExist({
        email: dto.email,
      });
      if (isEmailExist) {
        throw new BadRequestException(
          `Пользователь с адресом электронной почты ${dto.email} уже зарегистрирован`,
        );
      }
    }

    try {
      const user = await this.usersRepository.create(dto);
      const userForRes = CommonMethods.prepareUsersBaseForRes({
        users: [user],
        userId: user.id,
      })[0];
      return userForRes;
    } catch (err) {
      return err;
    }
  }

  async getUserBy({ userId, username }: TFindUserByArgs): Promise<TUserBase> {
    try {
      const user = await this.usersRepository.findOneBy({ userId, username });
      const userForRes = CommonMethods.prepareUsersBaseForRes({
        users: [user],
        userId,
      })[0];
      return userForRes;
    } catch (err) {
      return err;
    }
  }

  async getUsersBy(query: string, userId: string): Promise<TUserBase[]> {
    try {
      const users = await this.usersRepository.findMany(query);
      const usersForRes = CommonMethods.prepareUsersBaseForRes({
        users,
        userId,
      });
      return usersForRes;
    } catch (err) {
      return err;
    }
  }

  async getUserWishes(username: string, userId: string): Promise<TWishFull[]> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new BadRequestException(
        `Пользователь с именем ${username} не найден`,
      );
    }
    const wishes = await this.usersRepository.findUserWishes(username);
    const wishesForRes = CommonMethods.prepareWishesForRes({ wishes, userId });
    return wishesForRes;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<TUserBase> {
    const user = await this.usersRepository.findOneBy({ userId });

    if (dto.username && dto.username !== user.username) {
      const isUsernameExist = await this.usersRepository.isUserExist({
        username: dto.username,
      });
      if (isUsernameExist)
        throw new BadRequestException(
          `Имя пользователя ${dto.username} уже занято. Выберите другое имя пользователя`,
        );
    }

    if (dto.email && dto.email !== user.email) {
      const isEmailExist = await this.usersRepository.isUserExist({
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

    try {
      const user = await this.usersRepository.updateOne(userId, dto);
      const userForRes = CommonMethods.prepareUsersBaseForRes({
        users: [user],
        userId,
      })[0];
      return userForRes;
    } catch (err) {
      return err;
    }
  }
}
