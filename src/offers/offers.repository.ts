import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const offer = await this.repository.save({ ...dto, user, item: wish });
    return offer;
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
