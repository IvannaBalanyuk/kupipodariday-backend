import { Controller, Get, Post, Body, Patch, Param, Req } from '@nestjs/common';

import { TNoPwdUser, TUserReq } from '../common/types';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Req() { user }: TUserReq): Promise<TNoPwdUser> {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  update(@Req() { user }: TUserReq, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne(user.id, dto);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post('find')
  findMany(@Body() dto: FindUserDto) {
    return this.usersService.findMany(dto.query);
  }
}
