import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

import { CommonEntity } from '../../common/common-entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  @IsString()
  @Length(2, 30, {
    message: 'Допустимая длина поля username - от 2 до 30 символов',
  })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200, {
    message: 'Допустимая длина поля about - от 2 до 200 символов',
  })
  @IsOptional()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
