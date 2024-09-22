import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username of user',
    type: 'string',
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: 'Password',
    type: 'string',
  })
  @IsNotEmpty()
  password: string;
}
