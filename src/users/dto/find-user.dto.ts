import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindUserDto {
  @IsString()
  @ApiProperty({ example: 'mail.ru' })
  query: string;
}
