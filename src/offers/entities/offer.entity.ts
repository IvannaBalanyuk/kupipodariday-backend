import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';

import { CommonEntity } from 'src/utils/common-entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля amount - число с количеством знаков после запятой не более 2',
    },
  )
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
