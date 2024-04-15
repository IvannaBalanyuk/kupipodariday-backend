import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishesModule } from '../wishes/wishes.module';
import { CommonModule } from '../common/common.module';
import { HashModule } from '../hash/hash.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WishesModule,
    CommonModule,
    HashModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
