import {
  TUserBase,
  TUserFull,
  TOffer,
  TWishBase,
  TWishFull,
  TWishlist,
} from './types';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

// Функции для подготовки данных к отправке на клиент
function prepareUserForRes({
  users,
  userId,
}: {
  users: User[];
  userId?: string;
}): TUserFull[] {
  let preparedUsers: TUserFull[];
  if (users.length > 0) {
    preparedUsers = users.map((user) => {
      const { wishes, offers, wishlists, ...rest } = user;

      const preparedWishes = this.prepareWishesBaseForRes(wishes);
      const preparedOffers = this.prepareOffersForRes({ offers, userId });
      const preparedWishlists = this.prepareWishlistsForRes({
        wishlists,
        userId,
      });

      const preparedUser = {
        ...rest,
        wishes: preparedWishes,
        offers: preparedOffers,
        wishlists: preparedWishlists,
      };
      return preparedUser;
    });
  } else {
    preparedUsers = users;
  }
  return preparedUsers;
}

function prepareWishesForRes({
  wishes,
  userId,
  isPublic = false,
}: {
  wishes: Wish[];
  userId?: string;
  isPublic?: boolean;
}): TWishFull[] {
  let preparedWishes: TWishFull[];
  if (wishes.length > 0) {
    preparedWishes = wishes.map((wish) => {
      const { owner, offers, ...rest } = wish;
      const preparedOwner = this.prepareUsersBaseForRes({
        users: [owner],
        userId,
      })[0];
      const preparedOffers = this.prepareOffersForRes({
        offers,
        userId,
        isPublic,
      });

      const preparedWish = {
        ...rest,
        owner: preparedOwner,
        offers: preparedOffers,
      };
      return preparedWish;
    });
  } else {
    preparedWishes = wishes;
  }
  return preparedWishes;
}

function prepareOffersForRes({
  offers,
  userId,
  isPublic = false,
}: {
  offers: Offer[];
  userId?: string;
  isPublic?: boolean;
}): TOffer[] {
  let preparedOffers: TOffer[];
  if (offers instanceof Array && offers.length > 0) {
    preparedOffers = offers.map((offer) => {
      const { user, item, ...rest } = offer;
      const preparedUser = this.prepareUsersBaseForRes({
        users: [user],
        userId,
      })[0];
      const preparedItem = this.prepareWishesBaseForRes([item])[0];

      const preparedOffer = {
        ...rest,
        user: preparedUser,
        item: preparedItem,
      };

      if (
        isPublic ||
        (userId && offer.user.id !== userId && preparedOffer.hidden)
      ) {
        preparedOffer.amount = 0;
      }

      return preparedOffer;
    });
  } else {
    preparedOffers = offers;
  }
  return preparedOffers;
}

function prepareWishlistsForRes({
  wishlists,
  userId,
}: {
  wishlists: Wishlist[];
  userId?: string;
}): TWishlist[] {
  let preparedWishlists: TWishlist[];
  if (wishlists.length > 0) {
    preparedWishlists = wishlists.map((wishlist) => {
      const { owner, items, ...rest } = wishlist;

      const preparedOwner = this.prepareUsersBaseForRes({
        users: [owner],
        userId,
      })[0];
      const preparedItems = this.prepareWishesBaseForRes(items);

      const preparedOffer = {
        ...rest,
        owner: preparedOwner,
        items: preparedItems,
      };
      return preparedOffer;
    });
  } else {
    preparedWishlists = wishlists;
  }
  return preparedWishlists;
}

function prepareUsersBaseForRes({
  users,
  userId,
}: {
  users: User[];
  userId?: string;
}): TUserBase[] {
  let preparedUsers: TUserBase[];
  if (users.length > 0) {
    preparedUsers = users.map((user) => {
      const { password, wishes, offers, wishlists, email, ...preparedUser } =
        user;

      if (userId && preparedUser.id === userId) {
        return { ...preparedUser, email };
      } else {
        return preparedUser;
      }
    });
  } else {
    preparedUsers = users;
  }
  return preparedUsers;
}

function prepareWishesBaseForRes(wishes: Wish[]): TWishBase[] {
  let preparedWishes: TWishBase[];
  if (wishes.length > 0) {
    preparedWishes = wishes.map((wish) => {
      const { owner, offers, wishlists, ...preparedWish } = wish;
      return preparedWish;
    });
  } else {
    preparedWishes = wishes;
  }
  return preparedWishes;
}

export const CommonMethods = {
  prepareUserForRes,
  prepareWishesForRes,
  prepareOffersForRes,
  prepareWishlistsForRes,
  prepareUsersBaseForRes,
  prepareWishesBaseForRes,
};
