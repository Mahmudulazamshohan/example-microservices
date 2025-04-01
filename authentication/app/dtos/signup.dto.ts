import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public username: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  public firstname: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  public lastname: string;
}
