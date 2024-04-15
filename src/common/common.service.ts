import { ForbiddenException, Injectable } from '@nestjs/common';

import {
  TUserBase,
  TUserFull,
  TOffer,
  TWishBase,
  TWishFull,
  TWishlist,
} from '../utils/types';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

@Injectable()
export class CommonService {
  // Методы для проверки возможности выполнения запрошенного действия
  checkIsOwner(ownerId: string, userId: string): boolean | Error {
    if (ownerId !== userId) {
      throw new ForbiddenException(
        'Изменять и удалять можно только свои подарки',
      );
    } else {
      return true;
    }
  }

  checkHasNoOffers(offersLength: number) {
    if (offersLength > 0) {
      throw new ForbiddenException(
        'Действие не доступно, на подарок уже начат сбор',
      );
    } else {
      return true;
    }
  }

  checkIsNotOwner(ownerId: string, userId: string): boolean | Error {
    if (ownerId === userId) {
      throw new ForbiddenException('На свои подарки донатить нельзя');
    } else {
      return true;
    }
  }

  checkCanMakeOffer({
    price,
    raised,
    amount,
  }: {
    price: number;
    raised: number;
    amount: number;
  }): boolean | Error {
    if (price === raised) {
      throw new ForbiddenException('На данный подарок уже собраны средства');
    } else if (price < raised + amount) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    } else {
      return true;
    }
  }

  // Методы для подготовки данных к отправке на клиент
  prepareUserForRes(users: User[]): TUserFull[] {
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

  prepareWishesForRes(wishes: Wish[]): TWishFull[] {
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

  prepareOffersForRes(offers: Offer[]): TOffer[] {
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

  prepareWishlistsForRes(wishlists: Wishlist[]): TWishlist[] {
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

  prepareUsersBaseForRes({
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

  prepareWishesBaseForRes(wishes: Wish[]): TWishBase[] {
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
}
