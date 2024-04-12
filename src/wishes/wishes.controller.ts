import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { GUARDS } from '../auth/guards';
import { TUserReq } from '../common/types';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(GUARDS.jwtAuth)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() { user }: TUserReq) {
    return this.wishesService.create(createWishDto, user.id);
  }
}
