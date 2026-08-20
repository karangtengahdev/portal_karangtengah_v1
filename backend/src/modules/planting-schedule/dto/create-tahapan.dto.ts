import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTahapanDto {
  @ApiProperty({ example: 'Penyemaian Benih', description: 'Nama tahapan kegiatan' })
  @IsString()
  @MinLength(2)
  namaTahapan: string;

  @ApiProperty({ example: '2026-09-02T00:00:00.000Z', description: 'Tanggal mulai tahapan (ISO 8601)' })
  @IsDateString()
  tanggalMulai: string;

  @ApiProperty({ example: '2026-09-10T00:00:00.000Z', required: false, description: 'Tanggal selesai tahapan (opsional)' })
  @IsOptional()
  @IsDateString()
  tanggalSelesai?: string;

  @ApiProperty({ example: 1, description: 'Urutan tampil di timeline (mulai dari 1)' })
  @IsInt()
  @Min(1)
  urutan: number;

  @ApiProperty({ example: 'Benih disemai di persemaian selama 21 hari', required: false })
  @IsOptional()
  @IsString()
  deskripsi?: string;
}
