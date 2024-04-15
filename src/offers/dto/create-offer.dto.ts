import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOfferDto {
  @IsString()
  itemId: string;

  @IsNumber()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
