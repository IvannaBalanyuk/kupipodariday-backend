import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250, {
    message: 'Допустимая длина поля name - не более 250 символов',
  })
  name: string;

  @IsString()
  @MaxLength(1500, {
    message: 'Допустимая длина поля description - не более 1500 символов',
  })
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  image: string;

  @IsArray()
  itemsId: string[];
}
