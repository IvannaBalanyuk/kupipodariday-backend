import { DeleteResult, In, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { User } from '../users/entities/user.entity';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesRepository {
  constructor(
    @InjectRepository(Wish)
    private repository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, wishOwner: User): Promise<Wish> {
    const wishInstance = this.repository.create({
      ...dto,
      owner: wishOwner,
    });

    const errors = await validate(wishInstance);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    const wish: Wish = await this.repository.save(wishInstance);
    return wish;
  }

  async findOne(id: string): Promise<Wish> {
    let wish: Wish;
    try {
      wish = await this.repository.findOne({
        relations: ['owner', 'offers', 'offers.user', 'offers.item'],
        where: { id },
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const error = err.driverError;
        if (error.code === '22P02') {
          throw new BadRequestException('Подарок с таким id не найден');
        }
      }
    }
    return wish;
  }

  async findLast(): Promise<Wish[]> {
    const wishes: Wish[] = await this.repository.find({
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes: Wish[] = await this.repository.find({
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
      order: { copied: 'desc' },
      take: 10,
    });
    return wishes;
  }

  async findMany(wishIds: string[]): Promise<Wish[]> {
    return await this.repository.find({
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
      where: { id: In(wishIds) },
    });
  }

  async update(id: string, dto: UpdateWishDto): Promise<Wish> {
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async copy(wishId: string, owner: User): Promise<Wish> {
    const { id, createdAt, updatedAt, copied, raised, offers, ...dataWish } =
      await this.findOne(wishId);
    await this.repository.update(id, { copied: copied + 1 });
    return this.repository.save({
      ...dataWish,
      owner,
    });
  }

  async removeOne(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
