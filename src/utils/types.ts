export type TJwtPayload = {
  id: string;
  username: string;
};

export type TUserReq = { user: TJwtPayload };

export type TToken = { access_token: string };

export type TFindUserByArgs = {
  userId?: string;
  username?: string;
  email?: string;
};

export type TUserBase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  about: string;
  avatar: string;
  email?: string;
};

export type TUserExtra = {
  wishes: TWishBase[];
  offers: TOffer[];
  wishlists: TWishlist[];
};

export type TUserFull = TUserBase & TUserExtra;

export type TOffer = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: TUserBase;
  item: TWishBase;
  amount: number;
  hidden: boolean;
};

export type TWishBase = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  link: string;
  image: string;
  price: number;
  raised?: number;
  copied?: number;
  description?: string;
};

export type TWishExtra = {
  owner: TUserBase;
  offers: TOffer[];
  wishlists: TWishlist[];
};

export type TWishFull = TWishBase & TWishExtra;

export type TWishlist = {
  name: string;
  description: string;
  image: string;
  owner: TUserBase;
  items: TWishBase[];
};
