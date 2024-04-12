import { IsString, Length, IsOptional, IsUrl, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(2, 30, {
    message: 'Допустимая длина поля username - от 2 до 30 символов',
  })
  username: string;

  @IsString()
  @Length(2, 200, {
    message: 'Допустимая длина поля about - от 2 до 200 символов',
  })
  @IsOptional()
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
