export type TUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  about: string;
  avatar: string;
  email?: string;
  password?: string;
};

export type TJwtPayload = {
  id: string;
  username: string;
};

export type TUserReq = { user: TJwtPayload };

export type TToken = { access_token: string };
