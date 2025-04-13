import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
