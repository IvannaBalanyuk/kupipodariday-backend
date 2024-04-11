import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  Like,
  QueryFailedError,
  Repository,
} from 'typeorm';

import { TNoPwdUser } from '../common/types';
import { HashHelper } from '../hash/hash.helper';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type TIsUserExistParams = {
  id?: string;
  username?: string;
  email?: string;
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
  }: TIsUserExistParams): Promise<boolean> {
    return await this.usersRepository.exists({
      where: [{ username }, { email }],
    });
  }

  async findById(id: string): Promise<TNoPwdUser> {
    try {
      const { password, ...user } = await this.usersRepository.findOneOrFail({
        where: { id },
      });
      return user;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Пользователь с таким id не найден');
      }
    }
  }

  async create(dto: CreateUserDto): Promise<TNoPwdUser> {
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
    try {
      const { password, ...user } = await this.usersRepository.save(
        userInstance,
      );
      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if (error.code === '23505') {
          throw new ConflictException(
            'Пользователь с указанным именем пользователя или email уже зарегистрирован',
          );
        }
      }
    }
  }

  async findOne(username: string): Promise<TNoPwdUser> {
    try {
      const { password, ...user } = await this.usersRepository.findOneOrFail({
        where: { username },
      });
      return user;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException(`Пользователь ${username} не найден`);
      }
    }
  }

  async findMany(query: string): Promise<TNoPwdUser[]> {
    try {
      const users: User[] = await this.usersRepository.find({
        where: [
          { username: Like(`%${query}%`) },
          { email: Like(`%${query}%`) },
        ],
      });
      users.forEach((user) => {
        delete user.password;
        return user;
      });
      return users;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Не найдено ни одного соответствия');
      }
    }
  }

  async updateOne(id: string, dto: UpdateUserDto): Promise<TNoPwdUser> {
    const user: TNoPwdUser = await this.findById(id);

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
    return this.findById(id);
  }
}
