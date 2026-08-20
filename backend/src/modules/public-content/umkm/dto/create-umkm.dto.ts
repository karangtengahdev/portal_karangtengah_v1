import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { ProductDto } from './product.dto';

export class CreateUmkmDto {
  @ApiProperty({ example: 'Keripik Tela Bu Sari', description: 'Nama usaha' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Bu Sari', required: false, description: 'Nama pemilik' })
  @IsOptional() @IsString() ownerName?: string;

  @ApiProperty({ example: 'Keripik singkong renyah aneka rasa.', required: false })
  @IsOptional() @IsString() description?: string;

  @ApiProperty({ example: 'makanan', required: false, description: 'makanan | kerajinan | tani | lainnya' })
  @IsOptional() @IsString() category?: string;

  @ApiProperty({ example: 'https://.../cover.jpg', required: false })
  @IsOptional() @IsString() coverUrl?: string;

  @ApiProperty({ example: '081234567801', required: false, description: 'Nomor WA/telepon' })
  @IsOptional() @IsString() contactPhone?: string;

  @ApiProperty({ example: 'Padukuhan Karangtengah', required: false })
  @IsOptional() @IsString() contactAddress?: string;

  @ApiProperty({ type: [ProductDto], required: false, description: 'Daftar produk' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products?: ProductDto[];
}
