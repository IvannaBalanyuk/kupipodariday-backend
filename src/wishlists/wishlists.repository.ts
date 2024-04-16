import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsRepository {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repository: Repository<Wishlist>,
  ) {}

  async create(
    dto: CreateWishlistDto,
    owner: User,
    items: Wish[],
  ): Promise<Wishlist> {
    const wishlist = await this.repository.save({ ...dto, owner, items });
    return wishlist;
  }

  async findOne(id: string): Promise<Wishlist> {
    let wishlist: Wishlist;
    try {
      wishlist = await this.repository.findOne({
        where: { id },
        relations: ['owner', 'items'],
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if (error.code === '22P02') {
          throw new BadRequestException('Вишлист с таким id не найден');
        }
      }
    }
    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    let wishlists: Wishlist[];
    try {
      wishlists = await this.repository.find({
        relations: ['owner', 'items'],
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if (error.code === '22P02') {
          throw new BadRequestException('Ни один вишлист не найден');
        }
      }
    }
    return wishlists;
  }

  async update(
    id: string,
    dto: UpdateWishlistDto,
    wishlist: Wishlist,
  ): Promise<UpdateResult> {
    if (dto.itemsId) {
      await this.repository.save(wishlist);
    }
    return await this.repository.update(id, dto);
  }

  async removeOne(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
