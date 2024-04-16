import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TJwtPayload, TToken, TUserBase } from '../utils/types';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashHelper } from '../hash/hash.helper';

import { SignUpDto } from './dto/signup.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashHelper: HashHelper,
    private readonly userService: UsersService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user || !this.hashHelper.compare(password, user.password)) return null;

    return user;
  }

  async signup(dto: SignUpDto): Promise<TUserBase> {
    const createdUser = await this.userService.createUser(dto);
    return createdUser;
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
