import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  @ApiProperty({ example: '3f72e4a9-af8c-49d1-9f2c-3587a4605c51' })
  itemId: string;

  @IsNumber()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  @ApiProperty({ example: 100 })
  amount: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  hidden: boolean;
}
