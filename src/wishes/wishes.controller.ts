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
import { TUserReq, TWishFull } from '../utils/types';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(GUARDS.jwtAuth)
  @Post()
  async createWish(
    @Body() dto: CreateWishDto,
    @Req() { user }: TUserReq,
  ): Promise<TWishFull> {
    const res = await this.wishesService.createWish(user.id, dto);
    return res;
  }

  @Get('last')
  async getLastWishes(): Promise<TWishFull[]> {
    const res = await this.wishesService.findLast();
    return res;
  }

  @Get('top')
  async getTopWishes(): Promise<TWishFull[]> {
    const res = await this.wishesService.findTop();
    return res;
  }

  @UseGuards(GUARDS.jwtAuth)
  @Get(':id')
  async getWish(@Param('id') id: string): Promise<TWishFull> {
    const res = await this.wishesService.getWish(id);
    return res;
  }

  @UseGuards(GUARDS.jwtAuth)
  @Patch(':id')
  async updateWish(
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
    @Req() { user }: TUserReq,
  ): Promise<TWishFull> {
    const res = await this.wishesService.updateWish(id, user.id, dto);
    return res;
  }

  @UseGuards(GUARDS.jwtAuth)
  @Delete(':id')
  async removeWish(
    @Param('id') id: string,
    @Req() { user }: TUserReq,
  ): Promise<TWishFull> {
    const res = await this.wishesService.removeWish(id, user.id);
    return res;
  }

  @UseGuards(GUARDS.jwtAuth)
  @Post(':id/copy')
  async copyWish(
    @Param('id') id: string,
    @Req() { user }: TUserReq,
  ): Promise<TWishFull> {
    const res = await this.wishesService.copyWish(id, user.id);
    return res;
  }
}
