import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';

import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { OffersRepository } from './offers.repository';
import { OffersController } from './offers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), WishesModule, UsersModule],
  controllers: [OffersController],
  providers: [OffersService, OffersRepository],
})
export class OffersModule {}
