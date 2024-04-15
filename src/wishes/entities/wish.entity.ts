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

import { CommonEntity } from '../../utils/common-entity';
import { ColumnNumericTransformer } from '../../utils/common-methods';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

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

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля price - число с количеством знаков после запятой не более 2',
    },
  )
  @IsPositive()
  price: number;

  @Column({
    type: 'numeric',
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
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

  @Column({ default: 0 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
