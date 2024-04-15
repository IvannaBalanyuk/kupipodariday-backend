import { Controller, Body, Req, Post, UseGuards } from '@nestjs/common';

import { TJwtPayload, TToken, TUserBase } from '../utils/types';

import { AuthService } from './auth.service';
import { GUARDS } from './guards';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto): Promise<TUserBase> {
    const user = await this.authService.signup(dto);
    return user;
  }

  @UseGuards(GUARDS.localAuth)
  @Post('signin')
  async signin(@Req() req: { user: TJwtPayload }): Promise<TToken> {
    const token = await this.authService.signin(req.user);
    return token;
  }
}
