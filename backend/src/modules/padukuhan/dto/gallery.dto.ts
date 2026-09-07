import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePadukuhanGalleryDto {
  @ApiProperty({ example: 'https://.../foto.jpg' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
