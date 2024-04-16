import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    example: 'Мой вишлист',
  })
  name: string;

  @IsString()
  @MaxLength(1500, {
    message: 'Допустимая длина поля description - не более 1500 символов',
  })
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Всякое разное',
  })
  description: string;

  @IsString()
  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  @ApiProperty({
    type: String,
    example:
      'https://content.img-gorod.ru/nomenclature/27/881/2788173.jpg?width=0&height=1200&fit=bounds',
  })
  image: string;

  @IsArray()
  @ApiProperty({
    type: [String],
    example: [
      '3f72e4a9-af8c-49d1-9f2c-3587a4605c51',
      '91cd354b-6ae5-43c4-831a-1aae955ec1e3',
    ],
  })
  itemsId: string[];
}
