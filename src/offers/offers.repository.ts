import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { validate } from 'class-validator';

@Injectable()
export class OffersRepository {
  constructor(
    @InjectRepository(Offer)
    private readonly repository: Repository<Offer>,
  ) {}

  async create(dto: CreateOfferDto, user: User, wish: Wish): Promise<Offer> {
    console.log('createTTTTTTT');
    const offer = this.repository.create({ ...dto, user, item: wish });

    const errors = await validate(offer);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    const savedOffer = await this.repository.save(offer);
    return savedOffer;
  }

  async findOne(id: string): Promise<Offer> {
    const offer = this.repository.findOne({ where: { id } });
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.repository.find({
      relations: ['user', 'item'],
    });
    return offers;
  }
}
