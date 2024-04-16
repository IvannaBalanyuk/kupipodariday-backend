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
  @ApiProperty({ example: 'ab0381c3-57cd-45c0-97bd-fbd50fd996c5' })
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
