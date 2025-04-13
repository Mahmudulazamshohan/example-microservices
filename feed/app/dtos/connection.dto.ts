import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ConnectionStatus } from '../entities/Connection';

export class CreateConnectionDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  requester_id: number;

  @ApiProperty({ type: 'number' })
  @IsInt()
  @IsNotEmpty()
  addressee_id: number;
}

export class UpdateConnectionDto {
  @ApiPropertyOptional({ enum: ConnectionStatus })
  @IsEnum(ConnectionStatus)
  @IsOptional()
  status?: ConnectionStatus;
}
