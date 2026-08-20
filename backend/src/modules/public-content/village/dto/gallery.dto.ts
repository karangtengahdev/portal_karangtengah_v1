import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({ example: 'https://.../foto.jpg', description: 'URL gambar' })
  @IsString() imageUrl: string;

  @ApiProperty({ example: 'Sawah Karangtengah', required: false })
  @IsOptional() @IsString() caption?: string;

  @ApiProperty({ example: 0, required: false, description: 'Urutan tampil' })
  @IsOptional() @IsInt() @Min(0) orderIndex?: number;
}
