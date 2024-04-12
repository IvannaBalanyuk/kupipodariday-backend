import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  name: string;

  @IsUrl({
    message: 'Допустимое значение поля link - валидный url',
  })
  link: string;

  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  image: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля price - число с количеством знаков после запятой не более 2',
    },
  )
  @IsPositive()
  price: number;

  @IsString()
  @Length(1, 1024, {
    message: 'Допустимая длина поля description - не более 1024 символов',
  })
  @IsOptional()
  description: string;
}
