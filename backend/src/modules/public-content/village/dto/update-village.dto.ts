import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVillageDto {
  @ApiProperty({ example: 'Mewujudkan desa smart farming.', required: false })
  @IsOptional() @IsString() vision?: string;

  @ApiProperty({ example: 'Memberdayakan pemuda dan petani.', required: false })
  @IsOptional() @IsString() mission?: string;

  @ApiProperty({ example: 'Kalurahan Karangtengah, Imogiri, Bantul.', required: false })
  @IsOptional() @IsString() description?: string;

  @ApiProperty({ example: [{ title: 'Pertanian Padi', desc: 'Lahan produktif.' }], required: false, description: 'Array potensi desa' })
  @IsOptional() potency?: any;

  @ApiProperty({ example: { population: 6800, families: 1709, area_ha: 350 }, required: false, description: 'Statistik demografi' })
  @IsOptional() stats?: any;
}
