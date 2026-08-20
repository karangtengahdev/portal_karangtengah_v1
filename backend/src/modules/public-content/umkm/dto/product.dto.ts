import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'Keripik Original', description: 'Nama produk' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 12000, description: 'Harga dalam rupiah' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'bungkus', required: false, description: 'Satuan: pcs, kg, bungkus' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: 50, required: false, description: 'Jumlah stok' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: 'https://.../produk.jpg', required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ example: '200gr', required: false, description: 'Catatan produk' })
  @IsOptional()
  @IsString()
  note?: string;
}
