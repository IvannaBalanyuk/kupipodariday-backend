import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { TWishFull } from '../utils/types';
import { UsersRepository } from '../users/users.repository';
import { CommonMethods } from '../utils/common-methods';

import { Wish } from './entities/wish.entity';
import { WishesRepository } from './wishes.repository';
import { UpdateWishDto } from './dto/update-wish.dto';
import { CreateWishDto } from './dto/create-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    private readonly wishesRepository: WishesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createWish(userId: string, dto: CreateWishDto): Promise<TWishFull> {
    try {
      const owner = await this.usersRepository.findOneBy({ userId });
      const createdWish = await this.wishesRepository.create(dto, owner);

      // Подготовка объекта для ответа сервера:
      const wishForRes = CommonMethods.prepareWishesForRes({
        wishes: [createdWish],
        userId,
      })[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async copyWish(wishId: string, userId: string): Promise<TWishFull> {
    const owner = await this.usersRepository.findOneBy({ userId });

    // Проверка на допустимость действия:
    const hasThatWish = owner.wishes.find((wish: Wish) => wish.id === wishId);
    if (hasThatWish) {
      throw new ForbiddenException(
        'Этот подарок уже есть в Вашем списке подарков',
      );
    }

    const copiedWish = await this.wishesRepository.copy(wishId, owner);

    // Подготовка объекта для ответа сервера:
    const wishForRes = CommonMethods.prepareWishesForRes({
      wishes: [copiedWish],
      userId,
    })[0];
    return wishForRes;
  }

  async getWish(id: string, userId: string): Promise<TWishFull> {
    try {
      const wish = await this.wishesRepository.findOne(id);

      // Подготовка объекта для ответа сервера:
      const wishForRes = CommonMethods.prepareWishesForRes({
        wishes: [wish],
        userId,
      })[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async findLast(userId: string): Promise<TWishFull[]> {
    const wishes = await this.wishesRepository.findLast();

    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return CommonMethods.prepareWishesForRes({ wishes: [wish], userId })[0];
    });
    return wishesForRes;
  }

  async findTop(userId: string): Promise<TWishFull[]> {
    const wishes = await this.wishesRepository.findTop();

    if (!wishes) {
      throw new BadRequestException('Список подарков пока ещё пуст');
    }

    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return CommonMethods.prepareWishesForRes({ wishes: [wish], userId })[0];
    });
    return wishesForRes;
  }

  async getWishes(wishIds: string[], userId: string): Promise<TWishFull[]> {
    const wishes = await this.wishesRepository.findMany(wishIds);

    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return CommonMethods.prepareWishesForRes({ wishes: [wish], userId })[0];
    });
    return wishesForRes;
  }

  async updateWish(
    id: string,
    userId: string,
    dto: UpdateWishDto,
  ): Promise<TWishFull> {
    try {
      const wish = await this.wishesRepository.findOne(id);

      if (!wish) {
        throw new BadRequestException('Подарок с таким id не найден');
      }

      // Проверка на допустимость действия:
      this.checkIsOwner(wish.owner.id, userId);
      if (dto.price) this.checkHasNoOffers(wish.offers.length);

      const updatedWish = await this.wishesRepository.update(id, dto);

      // Подготовка объекта для ответа сервера:
      const wishForRes = CommonMethods.prepareWishesForRes({
        wishes: [updatedWish],
        userId,
      })[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async removeWish(id: string, userId: string): Promise<TWishFull> {
    try {
      const wish = await this.wishesRepository.findOne(id);

      if (!wish) {
        throw new BadRequestException('Подарок с таким id не найден');
      }

      // Проверка на допустимость действия:
      this.checkIsOwner(wish.owner.id, userId);
      this.checkHasNoOffers(wish.offers.length);

      this.wishesRepository.removeOne(id);

      // Подготовка объекта для ответа сервера:
      const wishForRes = CommonMethods.prepareWishesForRes({
        wishes: [wish],
        userId,
      })[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  private checkIsOwner(ownerId: string, userId: string): boolean | Error {
    if (ownerId !== userId) {
      throw new ForbiddenException(
        'Изменять и удалять можно только свои подарки',
      );
    } else {
      return true;
    }
  }

  private checkHasNoOffers(offersLength: number) {
    if (offersLength > 0) {
      throw new ForbiddenException(
        'Действие не доступно, на подарок уже начат сбор',
      );
    } else {
      return true;
    }
  }
}
