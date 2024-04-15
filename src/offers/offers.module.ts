import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishesRepository } from '../wishes/wishes.repository';
import { UsersService } from '../users/users.service';
import { CommonService } from '../common/common.service';

import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { OffersRepository } from './offers.repository';
import { OffersController } from './offers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesRepository,
    UsersService,
    CommonService,
  ],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
})
export class OffersModule {}
