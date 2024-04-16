import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsString, IsUrl, Length, MaxLength } from 'class-validator';

import { CommonEntity } from '../../utils/common-entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends CommonEntity {
  @Column({ unique: true })
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  name: string;

  @Column({ default: 'Описание отсутствует' })
  @IsString()
  @MaxLength(1500, {
    message: 'Допустимая длина поля description - не более 1500 символов',
  })
  description: string;

  @Column()
  @IsString()
  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  image: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wish, (wishlist) => wishlist.wishlists)
  @JoinTable()
  items: Wish[];
}
