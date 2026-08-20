import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class IngestDto {
  @ApiProperty({ example: 'ROVER-01', description: 'ID perangkat (Rover/Trap)' })
  @IsString()
  @MinLength(2)
  deviceId: string;

  @ApiProperty({ example: 'rover', description: 'Jenis data: rover | trap | status' })
  @IsString()
  type: string;

  @ApiProperty({
    example: { lat: -7.92, lng: 110.38, heading: 90, gpsFix: true, sats: 8, status: 'patrolling' },
    description: 'Isi data sesuai type. Rover: lat,lng,heading,gpsFix,sats,status. Trap: bebas.',
  })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({ example: '2026-06-15T10:00:00Z', required: false, description: 'Waktu rekam (opsional, default now)' })
  @IsOptional()
  @IsString()
  recordedAt?: string;
}
