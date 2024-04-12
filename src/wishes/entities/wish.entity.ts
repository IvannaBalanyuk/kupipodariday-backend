import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

import { CommonEntity } from 'src/common/common-entity';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { TUser } from 'src/common/types';

@Entity()
export class Wish extends CommonEntity {
  @Column()
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  name: string;

  @Column()
  @IsUrl({
    message: 'Допустимое значение поля link - валидный url',
  })
  link: string;

  @Column()
  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  image: string;

  @Column()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля price - число с количеством знаков после запятой не более 2',
    },
  )
  @IsPositive()
  price: number;

  @Column()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля raised - число с количеством знаков после запятой не более 2',
    },
  )
  @IsPositive()
  @IsOptional()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024, {
    message: 'Допустимая длина поля description - не более 1024 символов',
  })
  @IsOptional()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column()
  @IsInt()
  @IsPositive()
  @IsOptional()
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
