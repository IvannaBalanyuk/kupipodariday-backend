import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';

import { TJwtPayload, TToken, TUser } from '../common/types';

import { AuthService } from './auth.service';
import { GUARDS } from './guards';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto): Promise<TUser> {
    return this.authService.signup(dto);
  }

  @UseGuards(GUARDS.localAuth)
  @Post('signin')
  signin(@Request() req: { user: TJwtPayload }): Promise<TToken> {
    return this.authService.signin(req.user);
  }
}
