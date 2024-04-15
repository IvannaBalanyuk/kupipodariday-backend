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

// Функции для подготовки данных к отправке на клиент

function prepareUserForRes(users: User[]): TUserFull[] {
  let preparedUsers: TUserFull[];
  if (users.length > 0) {
    preparedUsers = users.map((user) => {
      const { wishes, offers, wishlists, ...rest } = user;

      const preparedWishes = this.prepareWishesBaseForRes(wishes);
      const preparedOffers = this.prepareOffersForRes(offers);
      const preparedWishlists = this.prepareWishlistsForRes(wishlists);

      const preparedUser = {
        wishes: preparedWishes,
        offers: preparedOffers,
        wishlists: preparedWishlists,
        ...rest,
      };
      return preparedUser;
    });
  } else {
    preparedUsers = users;
  }
  return preparedUsers;
}

function prepareWishesForRes(wishes: Wish[]): TWishFull[] {
  let preparedWishes: TWishFull[];
  if (wishes.length > 0) {
    preparedWishes = wishes.map((wish) => {
      const { owner, offers, wishlists, ...rest } = wish;

      const preparedOwner = this.prepareUsersBaseForRes({
        users: [owner],
      })[0];
      const preparedOffers = this.prepareOffersForRes(offers);
      const preparedWishlists = this.prepareWishlistsForRes(wishlists);

      const preparedWish = {
        owner: preparedOwner,
        offers: preparedOffers,
        wishlists: preparedWishlists,
        ...rest,
      };
      return preparedWish;
    });
  } else {
    preparedWishes = wishes;
  }
  return preparedWishes;
}

function prepareOffersForRes(offers: Offer[]): TOffer[] {
  let preparedOffers: TOffer[];
  if (offers.length > 0) {
    preparedOffers = offers.map((offer) => {
      const { user, item, ...rest } = offer;

      const preparedUser = this.prepareUsersBaseForRes({ users: [user] })[0];
      const preparedItem = this.prepareWishesBaseForRes([item])[0];

      const preparedOffer = {
        user: preparedUser,
        item: preparedItem,
        ...rest,
      };
      return preparedOffer;
    });
  } else {
    preparedOffers = offers;
  }
  return preparedOffers;
}

function prepareWishlistsForRes(wishlists: Wishlist[]): TWishlist[] {
  let preparedWishlists: TWishlist[];
  if (wishlists.length > 0) {
    preparedWishlists = wishlists.map((wishlist) => {
      const { owner, items, ...rest } = wishlist;

      const preparedOwner = this.prepareUsersBaseForRes({
        users: [owner],
      })[0];
      const preparedItems = this.prepareWishesBaseForRes(items);

      const preparedOffer = {
        owner: preparedOwner,
        items: preparedItems,
        ...rest,
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
  withEmail = false,
}: {
  users: User[];
  withEmail?: boolean;
}): TUserBase[] {
  let preparedUsers: TUserBase[];
  if (users.length > 0) {
    preparedUsers = users.map((user) => {
      const { password, wishes, offers, wishlists, email, ...preparedUser } =
        user;

      if (withEmail) {
        return { email, ...preparedUser };
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
