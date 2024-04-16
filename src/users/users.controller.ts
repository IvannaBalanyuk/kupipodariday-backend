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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { GUARDS } from '../auth/guards';
import { TUserReq, TUserBase, TWishFull } from '../utils/types';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(GUARDS.jwtAuth)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrUser(@Req() { user }: TUserReq): Promise<TUserBase> {
    const currUser = await this.usersService.getUserBy({
      userId: user.id,
    });
    return currUser;
  }

  @Patch('me')
  async updateCurrUser(
    @Req() { user }: TUserReq,
    @Body() dto: UpdateUserDto,
  ): Promise<TUserBase> {
    const updatedUser = await this.usersService.updateUser(user.id, dto);
    return updatedUser;
  }

  @Get('me/wishes')
  async getCurrUserWishes(@Req() { user }: TUserReq): Promise<TWishFull[]> {
    const wishes = await this.usersService.getUserWishes(
      user.username,
      user.id,
    );
    return wishes;
  }

  @Post('find')
  async getOtherUsers(
    @Body() dto: FindUserDto,
    @Req() { user }: TUserReq,
  ): Promise<TUserBase[]> {
    const users = await this.usersService.getUsersBy(dto.query, user.id);
    return users;
  }

  @Get(':username')
  async getOtherUser(
    @Param('username') username: string,
    @Req() { user }: TUserReq,
  ): Promise<TUserBase> {
    const currUser = await this.usersService.getUserBy({
      username,
      userId: user.id,
    });
    return currUser;
  }

  @Get(':username/wishes')
  async getOtherUserWishes(
    @Param('username') username: string,
    @Req() { user }: TUserReq,
  ): Promise<TWishFull[]> {
    const wishes = await this.usersService.getUserWishes(username, user.id);
    return wishes;
  }
}
