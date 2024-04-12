import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { jwtOptions } from '../configs/jwtconfig';
import { HashModule } from '../hash/hash.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GUARDS } from './guards';
import { STRATEGIES } from './strategies';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync(jwtOptions()),
    HashModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GUARDS.jwtAuth, GUARDS.localAuth, ...STRATEGIES],
})
export class AuthModule {}
