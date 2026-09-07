import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreatePadukuhanDto {
  @ApiProperty({ example: 'Karangtengah', description: 'Nama padukuhan' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Sumardiyono', required: false, description: 'Nama Kepala Dukuh' })
  @IsOptional()
  @IsString()
  kepalaDukuh?: string;

  @ApiProperty({ required: false, description: 'Teks sambutan Kepala Dukuh' })
  @IsOptional()
  @IsString()
  sambutan?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: false, description: 'true = tampilkan penuh di publik, false = tampil "Segera Hadir"' })
  @IsOptional()
  @IsBoolean()
  hasData?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
