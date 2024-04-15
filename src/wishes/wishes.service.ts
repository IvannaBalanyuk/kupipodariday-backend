import { ForbiddenException, Injectable } from '@nestjs/common';

import { TWishFull } from '../utils/types';
import { UsersRepository } from '../users/users.repository';
import { CommonService } from '../common/common.service';

import { Wish } from './entities/wish.entity';
import { WishesRepository } from './wishes.repository';
import { UpdateWishDto } from './dto/update-wish.dto';
import { CreateWishDto } from './dto/create-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    private readonly wishesRepository: WishesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly commonService: CommonService,
  ) {}

  async createWish(userId: string, dto: CreateWishDto): Promise<TWishFull> {
    try {
      // Обращение к базе данных (через сервис):
      const owner = await this.usersRepository.findOneBy({ id: userId });
      const createdWish = await this.wishesRepository.create(dto, owner);
      // Подготовка объекта для ответа сервера:
      const wishForRes = this.commonService.prepareWishesForRes([
        createdWish,
      ])[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async copyWish(wishId: string, userId: string): Promise<TWishFull> {
    const owner = await this.usersRepository.findOneBy({ id: userId });
    // Проверка на допустимость действия:
    const hasThatWish = owner.wishes.find((wish: Wish) => wish.id === wishId);
    if (hasThatWish) {
      throw new ForbiddenException(
        'Этот подарок уже есть в Вашем списке подарков',
      );
    }
    // Обращение к базе данных (через сервис):
    const copiedWish = await this.wishesRepository.copy(wishId, owner);
    // Подготовка объекта для ответа сервера:
    const wishForRes = this.commonService.prepareWishesForRes([copiedWish])[0];
    return wishForRes;
  }

  async getWish(id: string): Promise<TWishFull> {
    try {
      // Обращение к базе данных (через сервис):
      const wish = await this.wishesRepository.findOne(id);
      // Подготовка объекта для ответа сервера:
      const wishForRes = this.commonService.prepareWishesForRes([wish])[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async getLastWishes(): Promise<TWishFull[]> {
    // Обращение к базе данных (через сервис):
    const wishes = await this.wishesRepository.findLast();
    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return this.commonService.prepareWishesForRes([wish])[0];
    });
    return wishesForRes;
  }

  async getTopWishes(): Promise<TWishFull[]> {
    // Обращение к базе данных (через сервис):
    const wishes = await this.wishesRepository.findTop();
    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return this.commonService.prepareWishesForRes([wish])[0];
    });
    return wishesForRes;
  }

  async getWishes(wishIds: number[]): Promise<TWishFull[]> {
    // Обращение к базе данных (через сервис):
    const wishes = await this.wishesRepository.findMany(wishIds);
    // Подготовка объекта для ответа сервера:
    const wishesForRes = wishes.map((wish) => {
      return this.commonService.prepareWishesForRes([wish])[0];
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
      // Проверка на допустимость действия:
      this.commonService.checkIsOwner(id, userId);
      if (dto.price) this.commonService.checkHasNoOffers(wish.offers.length);
      // Обращение к базе данных (через сервис):
      const updatedWish = await this.wishesRepository.update(id, dto);
      // Подготовка объекта для ответа сервера:
      const wishForRes = this.commonService.prepareWishesForRes([
        updatedWish,
      ])[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }

  async removeWish(id: string, userId: string): Promise<TWishFull> {
    try {
      const wish = await this.wishesRepository.findOne(id);
      // Проверка на допустимость действия:
      this.commonService.checkIsOwner(id, userId);
      this.commonService.checkHasNoOffers(wish.offers.length);
      // Обращение к базе данных (через сервис):
      this.wishesRepository.removeOne(id);
      // Подготовка объекта для ответа сервера:
      const wishForRes = this.commonService.prepareWishesForRes([wish])[0];
      return wishForRes;
    } catch (err) {
      return err;
    }
  }
}
