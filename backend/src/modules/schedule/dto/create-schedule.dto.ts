import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 'Pak Sutrisno', description: 'Nama petani' })
  @IsString() @MinLength(2) farmerName: string;

  @ApiProperty({ example: 'Sawah Blok A', required: false, description: 'Nama/kode lahan' })
  @IsOptional() @IsString() fieldName?: string;

  @ApiProperty({ example: 'Karangtengah', required: false, description: 'Padukuhan (untuk tanam serentak per wilayah)' })
  @IsOptional() @IsString() padukuhan?: string;

  @ApiProperty({ example: '2026-06-20', description: 'Tanggal tanam (YYYY-MM-DD)' })
  @IsDateString() plantDate: string;

  @ApiProperty({ example: '2026-10-13', required: false, description: 'Perkiraan panen. Kosongkan untuk hitung otomatis dari umur padi.' })
  @IsOptional() @IsDateString() estimatedHarvest?: string;

  @ApiProperty({ example: 115, required: false, description: 'Umur padi (hari) untuk hitung estimasi panen otomatis. Default 115.' })
  @IsOptional() @IsInt() @Min(60) cropDays?: number;

  @ApiProperty({ example: 'Varietas IR64', required: false })
  @IsOptional() @IsString() notes?: string;
}
