import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersRepository {
  constructor(
    @InjectRepository(Offer)
    private readonly repository: Repository<Offer>,
  ) {}

  async create(dto: CreateOfferDto, user: User, wish: Wish): Promise<Offer> {
    try {
      const offer = this.repository.create({ ...dto, user, item: wish });

      const errors = await validate(offer);
      if (errors.length > 0) {
        const messages = errors.map((error) => error.constraints);
        throw new BadRequestException(messages);
      }

      const savedOffer = await this.repository.save(offer);
      return savedOffer;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new BadRequestException('Сохранение не выполнено');
      }
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
