import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HashHelper } from '../hash/hash.helper';
import { TJwtPayload, TToken, TUser } from '../common/types';

import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashHelper: HashHelper,
  ) {}

  async validateUser(username: string, password: string): Promise<TUser> {
    const user = await this.userService.findOneBy({ username }, {});

    if (!user || !this.hashHelper.compare(password, user.password)) return null;

    return user;
  }

  signup(dto: SignUpDto): Promise<TUser> {
    return this.userService.create(dto);
  }

  async signin(user: TJwtPayload): Promise<TToken> {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return {
      access_token: token,
    };
  }
}
