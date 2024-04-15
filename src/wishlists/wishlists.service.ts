import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TWishlist } from '../utils/types';
import { CommonService } from '../common/common.service';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsRepository } from './wishlists.repository';
import { WishesRepository } from 'src/wishes/wishes.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: WishlistsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly wishesRepository: WishesRepository,
    private readonly commonService: CommonService,
  ) {}

  async createWishlist(
    dto: CreateWishlistDto,
    userId: string,
  ): Promise<TWishlist> {
    const owner = await this.usersRepository.findOneBy({ id: userId });
    const items = await this.wishesRepository.findMany(dto.itemsId);
    const wishlist = await this.wishlistRepository.create(dto, owner, items);

    // Подготовка объекта для ответа сервера:
    const wishlistForRes = this.commonService.prepareWishlistsForRes([
      wishlist,
    ])[0];
    return wishlistForRes;
  }

  async getWishlist(id: string): Promise<TWishlist> {
    try {
      const wishlist = await this.wishlistRepository.findOne(id);

      // Подготовка объекта для ответа сервера:
      const wishlistForRes = this.commonService.prepareWishlistsForRes([
        wishlist,
      ])[0];
      return wishlistForRes;
    } catch (err) {
      return err;
    }
  }

  async getWishlists(): Promise<TWishlist[]> {
    const wishlists = await this.wishlistRepository.findAll();

    // Подготовка объекта для ответа сервера:
    const wishlistsForRes =
      this.commonService.prepareWishlistsForRes(wishlists);
    return wishlistsForRes;
  }

  async updateWishlists(
    id: string,
    dto: UpdateWishlistDto,
    userId: string,
  ): Promise<TWishlist> {
    const wishlist = await this.wishlistRepository.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException(
        "You can't change other people's wishlists",
      );
    }

    if (dto.itemsId) {
      const { itemsId, ...restDto } = dto;
      const wishes = await this.wishesRepository.findMany(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistRepository.update(
        id,
        restDto as UpdateWishlistDto,
        wishlist,
      );
    } else {
      await this.wishlistRepository.update(id, dto, wishlist);
    }

    // Подготовка объекта для ответа сервера:
    const wishlistForRes = this.commonService.prepareWishlistsForRes([
      wishlist,
    ])[0];
    return wishlistForRes;
  }

  async removeWishlists(id: string, userId: string): Promise<TWishlist> {
    const wishlist = await this.wishlistRepository.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Удалять можно только свои вишлисты');
    }

    await this.wishlistRepository.removeOne(id);
    // Подготовка объекта для ответа сервера:
    const wishlistForRes = this.commonService.prepareWishlistsForRes([
      wishlist,
    ])[0];
    return wishlistForRes;
  }
}
