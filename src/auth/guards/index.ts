import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

export const GUARDS = {
  jwtAuth: JwtAuthGuard,
  localAuth: LocalAuthGuard,
};
