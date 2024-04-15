import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';

import { Wish } from './entities/wish.entity';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { WishesRepository } from './wishes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), CommonModule, UsersModule],
  controllers: [WishesController],
  providers: [WishesService, WishesRepository],
})
export class WishesModule {}
