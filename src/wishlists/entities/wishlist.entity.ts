import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsString, IsUrl, Length } from 'class-validator';

import { CommonEntity } from 'src/common/common-entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends CommonEntity {
  @Column({ unique: true })
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  name: string;

  @Column()
  @IsString()
  @Length(1, 1500, {
    message: 'Допустимая длина поля description - не более 1500 символов',
  })
  description: string;

  @Column()
  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  image: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
