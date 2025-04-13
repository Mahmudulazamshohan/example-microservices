import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MediaType } from '../entities/PostMedia';

export class CreatePostDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  is_active?: boolean;
}

export class CreatePostMediaDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({ enum: MediaType })
  @IsNotEmpty()
  media_type: MediaType;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  media_url: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsString()
  @IsOptional()
  caption?: string;
}
