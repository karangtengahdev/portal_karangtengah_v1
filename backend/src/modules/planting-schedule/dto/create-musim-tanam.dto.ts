import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateTahapanDto } from './create-tahapan.dto';

// Gunakan string literal agar tidak bergantung pada generated Prisma enum
// (enum Prisma baru tersedia setelah migrate)
export enum StatusMusimTanamDto {
  DRAFT = 'DRAFT',
  AKTIF = 'AKTIF',
  SELESAI = 'SELESAI',
}

export class CreateMusimTanamDto {
  @ApiProperty({ example: 'Musim Tanam Gadu 2026', description: 'Judul musim tanam (wajib)' })
  @IsString()
  @MinLength(3)
  judul: string;

  @ApiProperty({ example: 'uuid-komoditas', description: 'ID Komoditas (UUID)' })
  @IsUUID()
  komoditasId: string;

  @ApiProperty({ example: 'Blok A - Karangtengah', required: false, description: 'Blok/wilayah sawah' })
  @IsOptional()
  @IsString()
  lokasi?: string;

  @ApiProperty({ example: '2026-09-01T00:00:00.000Z', required: false, description: 'Tanggal mulai musim tanam (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  tanggalMulai?: string;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', required: false, description: 'Tanggal selesai musim tanam (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  tanggalSelesai?: string;

  @ApiProperty({
    enum: StatusMusimTanamDto,
    default: StatusMusimTanamDto.DRAFT,
    required: false,
    description: 'Status musim tanam: DRAFT | AKTIF | SELESAI',
  })
  @IsOptional()
  @IsEnum(StatusMusimTanamDto)
  status?: StatusMusimTanamDto;

  @ApiProperty({
    type: [CreateTahapanDto],
    required: false,
    description: 'Daftar tahapan awal (opsional, bisa ditambah belakangan)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTahapanDto)
  tahapan?: CreateTahapanDto[];
}
