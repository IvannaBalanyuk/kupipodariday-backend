import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TOffer } from '../utils/types';
import { CommonMethods } from '../utils/common-methods';
import { UsersRepository } from '../users/users.repository';
import { WishesRepository } from '../wishes/wishes.repository';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { OffersRepository } from './offers.repository';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: OffersRepository,
    private readonly wishesRepository: WishesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createOffer(userId: string, dto: CreateOfferDto): Promise<Offer> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      const wish = await this.wishesRepository.findOne(dto.itemId);

      // Проверка на допустимость действия:
      this.checkIsNotOwner(wish.owner.id, user.id);
      this.checkCanMakeOffer({
        price: wish.price,
        raised: wish.raised,
        amount: dto.amount,
      });

      const createdOffer = await this.offersRepository.create(dto, user, wish);
      console.log('createdOffer', createdOffer);

      await this.wishesRepository.update(dto.itemId, {
        raised: wish.raised + dto.amount,
      } as UpdateWishDto);

      return createdOffer;
    } catch (err) {
      return err;
    }
  }

  async getOffer(id: string): Promise<TOffer> {
    const offer = await this.offersRepository.findOne(id);
    const offerForRes = CommonMethods.prepareOffersForRes([offer])[0];
    return offerForRes;
  }

  async getOffers(): Promise<TOffer[]> {
    const offers = await this.offersRepository.findAll();
    const offersForRes = CommonMethods.prepareOffersForRes(offers);
    return offersForRes;
  }

  private checkIsNotOwner(ownerId: string, userId: string): boolean | Error {
    if (ownerId === userId) {
      throw new ForbiddenException('На свои подарки донатить нельзя');
    } else {
      return true;
    }
  }

  private checkCanMakeOffer({
    price,
    raised,
    amount,
  }: {
    price: number;
    raised: number;
    amount: number;
  }): boolean | Error {
    if (price === raised) {
      throw new ForbiddenException('На данный подарок уже собраны средства');
    } else if (price < raised + amount) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    } else {
      return true;
    }
  }
}
