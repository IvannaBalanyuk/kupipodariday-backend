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
import { validate } from 'class-validator';

import { TFindUserByArgs } from '../utils/types';
import { Wish } from '../wishes/entities/wish.entity';
import { HashHelper } from '../hash/hash.helper';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly hashHelper: HashHelper,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const userInstance = this.repository.create(dto);
    const errors = await validate(userInstance);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    userInstance.password = await this.hashHelper.getHash(dto.password);

    try {
      const user = await this.repository.save(userInstance);
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

  async findOneBy({ userId, username }: TFindUserByArgs): Promise<User> {
    try {
      const user: User = await this.repository.findOneOrFail({
        relations: [
          'wishes',
          'wishes.owner',
          'wishes.offers',
          'offers',
          'wishlists',
        ],
        where: [{ id: userId }, { username }],
      });
      return user;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Пользователь не найден');
      }
    }
  }

  async findMany(query: string): Promise<User[]> {
    try {
      return await this.repository.find({
        relations: [
          'wishes',
          'wishes.owner',
          'wishes.offers',
          'offers',
          'wishlists',
        ],
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

  async findUserWishes(username: string): Promise<Wish[]> {
    const { wishes } = await this.repository.findOne({
      select: ['wishes'],
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
        'wishes.offers.item',
        'wishlists',
      ],
      where: { username },
    });
    return wishes;
  }

  async updateOne(userId: string, dto: UpdateUserDto): Promise<User> {
    await this.repository.update(userId, dto);
    const updatedUser = this.findOneBy({ userId });
    return updatedUser;
  }

  async isUserExist({ username, email }: TFindUserByArgs): Promise<boolean> {
    const user = await this.repository.findOne({
      where: [{ username }, { email }],
    });
    if (user) return true;
    return false;
  }
}
