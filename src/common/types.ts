import { User } from '../users/entities/user.entity';

export type TNoPwdUser = Omit<User, 'password'>;

export type TUserPayload = {
  id: string;
  username: string;
};
export type TUserReq = { user: TUserPayload };
