import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ example: 'Pak Sutrisno', description: 'Nama petani' })
  @IsString() @MinLength(2) farmerName: string;

  @ApiProperty({ example: 'Sawah Blok A', required: false })
  @IsOptional() @IsString() fieldName?: string;

  @ApiProperty({ example: 'Karangtengah', required: false, description: 'Padukuhan' })
  @IsOptional() @IsString() padukuhan?: string;

  @ApiProperty({ example: 4.2, description: 'Berat hasil ubinan 2.5x2.5m (kg)' })
  @IsNumber() @Min(0) ubinanKg: number;

  @ApiProperty({ example: 0.5, description: 'Luas lahan petani (hektar) untuk estimasi total' })
  @IsNumber() @Min(0) areaHa: number;

  @ApiProperty({ example: 8.5, required: false, description: 'Persen kerusakan akibat hama (target < 15%)' })
  @IsOptional() @IsNumber() @Min(0) pestLossPct?: number;

  @ApiProperty({ example: '2026-10-15', description: 'Tanggal panen' })
  @IsDateString() harvestDate: string;

  @ApiProperty({ example: 'uuid-jadwal', required: false, description: 'ID jadwal tanam terkait (opsional)' })
  @IsOptional() @IsString() scheduleId?: string;
}
