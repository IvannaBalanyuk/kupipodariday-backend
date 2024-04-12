import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { validate } from 'class-validator';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateWishDto, userId: string) {
    const user = await this.usersService.findOneBy(
      { id: userId },
      { noPassword: true, noEmail: true },
    );

    const wishInstance = this.wishesRepository.create({
      ...dto,
      owner: user,
    });
    const errors = await validate(wishInstance);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    const { raised, offers, copied, wishlists, ...wish } =
      await this.wishesRepository.save(wishInstance);
    return wish;
  }
}
