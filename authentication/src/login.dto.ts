import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  username: string;

  @IsNotEmpty()
  password: string;
}
