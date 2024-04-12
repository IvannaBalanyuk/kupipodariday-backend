import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { GUARDS } from '../auth/guards';
import { TUserReq, TUser } from '../common/types';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GUARDS.jwtAuth)
  @Get('me')
  async findCurrUser(@Req() { user }: TUserReq): Promise<TUser> {
    return await this.usersService.findOneBy(
      { id: user.id },
      { noPassword: true },
    );
  }

  @UseGuards(GUARDS.jwtAuth)
  @Patch('me')
  async updateCurrUser(
    @Req() { user }: TUserReq,
    @Body() dto: UpdateUserDto,
  ): Promise<TUser> {
    return await this.usersService.updateOne(user.id, dto);
  }

  @UseGuards(GUARDS.jwtAuth)
  @Get(':username')
  async findOtherUser(@Param('username') username: string): Promise<TUser> {
    return await this.usersService.findOneBy(
      { username },
      { noEmail: true, noPassword: true },
    );
  }

  @UseGuards(GUARDS.jwtAuth)
  @Post('find')
  async findOtherUsers(@Body() dto: FindUserDto): Promise<TUser[]> {
    return await this.usersService.findMany(dto.query);
  }
}
