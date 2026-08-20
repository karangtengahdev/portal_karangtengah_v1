import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ example: 'Sosialisasi Akbar NAWASENA', description: 'Judul berita' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Ringkasan singkat berita.', required: false, description: 'Ringkasan untuk kartu/list' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: 'Isi lengkap berita minimal sepuluh karakter.', description: 'Konten lengkap (markdown/HTML)' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({ example: 'https://.../cover.jpg', required: false, description: 'URL cover (isi via upload)' })
  @IsOptional()
  @IsString()
  coverUrl?: string;

  // Field berikut diterima dari frontend tapi tidak disimpan ke kolom DB (kolom belum ada di schema).
  // Ditambahkan agar ValidationPipe (forbidNonWhitelisted) tidak menolak request.
  @ApiProperty({ example: 'Kegiatan', required: false, description: 'Kategori berita (UI only)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Tim Redaksi', required: false, description: 'Nama penulis (UI only)' })
  @IsOptional()
  @IsString()
  author?: string;
}
