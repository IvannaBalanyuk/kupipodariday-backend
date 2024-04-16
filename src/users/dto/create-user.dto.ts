import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30, {
    message: 'Допустимая длина поля username - от 2 до 30 символов',
  })
  @ApiProperty({ example: 'Ivanna' })
  username: string;

  @IsString()
  @Length(2, 200, {
    message: 'Допустимая длина поля about - от 2 до 200 символов',
  })
  @IsOptional()
  @ApiProperty({ example: 'About Ivanna' })
  about: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  avatar: string;

  @IsEmail()
  @ApiProperty({ example: 'user@yandex.ru' })
  email: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  password: string;
}
