import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Стивен Кинг "Стрелок. Извлечение троих. Бесплодные земли"',
  })
  name: string;

  @IsUrl({
    message: 'Допустимое значение поля link - валидный url',
  })
  @ApiProperty({
    example:
      'https://www.chitai-gorod.ru/product/strelok-izvlechenie-troih-besplodnye-zemli-2788173?productShelf&shelfIndex=0&productIndex=3',
  })
  link: string;

  @IsUrl({
    message: 'Допустимое значение поля image - валидный url',
  })
  @ApiProperty({
    example:
      'https://content.img-gorod.ru/nomenclature/27/881/2788173.jpg?width=0&height=1200&fit=bounds',
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
  @ApiProperty({ example: 10 })
  price: number;

  @IsString()
  @Length(1, 1024, {
    message: 'Допустимая длина поля description - не более 1024 символов',
  })
  @IsOptional()
  @ApiProperty({
    example:
      'Юный Роланд — последний благородный рыцарь в мире, «сдвинувшемся с места». Ему во что бы то ни стало нужно найти Темную Башню — средоточие Силы, краеугольный камень мироздания.',
  })
  description: string;
}
