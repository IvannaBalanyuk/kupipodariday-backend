import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { GUARDS } from '../auth/guards';
import { TOffer, TUserReq } from '../utils/types';

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(GUARDS.jwtAuth)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @Req() { user }: TUserReq,
  ): Promise<TOffer> {
    const offer = await this.offersService.createOffer(user.id, dto);
    return offer;
  }

  @Get()
  async getOffers(): Promise<TOffer[]> {
    const offers = await this.offersService.getOffers();
    return offers;
  }

  @Get(':id')
  async getOffer(@Param('id') id: string): Promise<TOffer> {
    const offer = await this.offersService.getOffer(id);
    return offer;
  }
}
