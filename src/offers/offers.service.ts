import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TOffer } from '../utils/types';
import { CommonService } from '../common/common.service';
import { UsersRepository } from '../users/users.repository';
import { WishesRepository } from '../wishes/wishes.repository';
import { Wish } from '../wishes/entities/wish.entity';
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
    private readonly commonService: CommonService,
  ) {}

  async createOffer(userId: string, dto: CreateOfferDto): Promise<TOffer> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      const wish: Wish = await this.wishesRepository.findOne(dto.itemId);

      // Проверка на допустимость действия:
      this.commonService.checkIsNotOwner(wish.owner.id, user.id);
      this.commonService.checkCanMakeOffer({
        price: wish.price,
        raised: wish.raised,
        amount: dto.amount,
      });

      await this.wishesRepository.update(dto.itemId, {
        raised: wish.raised + dto.amount,
      } as UpdateWishDto);
      const createdOffer = await this.offersRepository.create(dto, user, wish);

      // Подготовка объекта для ответа сервера:
      const offerForRes = this.commonService.prepareOffersForRes([
        createdOffer,
      ])[0];
      return offerForRes;
    } catch (err) {
      return err;
    }
  }

  async getOffer(id: string): Promise<TOffer> {
    const offer = await this.offersRepository.findOne(id);
    const offerForRes = this.commonService.prepareOffersForRes([offer])[0];
    return offerForRes;
  }

  async getOffers(): Promise<TOffer[]> {
    const offers = await this.offersRepository.findAll();
    const offersForRes = this.commonService.prepareOffersForRes(offers);
    return offersForRes;
  }
}
