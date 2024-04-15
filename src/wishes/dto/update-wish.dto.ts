import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  @IsOptional()
  name: string;

  @IsUrl({
    message: 'Допустимое значение поля link - валидный url',
  })
  @IsOptional()
  link: string;

  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  @IsOptional()
  image: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Допустимое значение поля price - число с количеством знаков после запятой не более 2',
    },
  )
  @IsPositive()
  @IsOptional()
  price: number;

  @IsString()
  @Length(1, 1024, {
    message: 'Допустимая длина поля description - не более 1024 символов',
  })
  @IsOptional()
  description: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  copied?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  raised?: number;
}
