import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiPropertyOptional({ type: 'number' })
  @IsInt()
  @IsOptional()
  parent_comment_id?: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  is_active?: boolean;
}
