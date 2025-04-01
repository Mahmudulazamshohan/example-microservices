import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    type: Number,
    description: 'User ID',
    required: true,
  })
  user_id: number;

  @ApiProperty({
    type: Number,
    description: 'Post ID',
    required: true,
  })
  post_id: number;

  @ApiProperty({
    type: String,
    description: 'Comment content',
    required: true,
  })
  content: string;
}
