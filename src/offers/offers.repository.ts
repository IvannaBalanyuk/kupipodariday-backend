import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';

@Injectable()
export class OffersRepository {
  constructor(
    @InjectRepository(Offer)
    private readonly repository: Repository<Offer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOfferDto, user: User, wish: Wish): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const offer = queryRunner.manager.getRepository(Offer).create({
        ...dto,
        user,
        item: wish,
      });

      const errors = await validate(offer);
      if (errors.length > 0) {
        const messages = errors.map((error) => error.constraints);
        throw new BadRequestException(messages);
      }

      const savedOffer = await queryRunner.manager
        .getRepository(Offer)
        .save(offer);

      await queryRunner.manager.getRepository(Wish).update(dto.itemId, {
        raised: wish.raised + dto.amount,
      } as UpdateWishDto);

      await queryRunner.commitTransaction();
      return savedOffer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Сохранение оффера не выполнено');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    try {
      return await this.repository.find({
        relations: ['user', 'item'],
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Не найдено ни одного соответствия');
      }
    }
  }

  async findOne(id: string): Promise<Offer> {
    try {
      return await this.repository.findOne({
        relations: ['user', 'item'],
        where: { id },
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Не найдено ни одного соответствия');
      }
    }
  }
}
