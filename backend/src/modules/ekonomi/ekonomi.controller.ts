import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { EkonomiService } from './ekonomi.service';

/** Rentang bawaan: musim tanam berjalan 2026. Ganti lewat query bila perlu. */
const DARI_BAWAAN = '2026-01-01';
const SAMPAI_BAWAAN = '2026-12-31';

function tanggal(nilai: string, label: string): Date {
  const d = new Date(nilai);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException(`Tanggal ${label} tidak valid. Gunakan format YYYY-MM-DD.`);
  }
  return d;
}

@ApiTags('public/ekonomi')
@Controller('public/ekonomi')
export class EkonomiController {
  constructor(private readonly ekonomi: EkonomiService) {}

  @Public()
  @Get('asumsi')
  @ApiOperation({
    summary: 'Asumsi perhitungan yang berlaku',
    description:
      'Mengembalikan ketetapan perhitungan dampak ekonomi beserta sumber tiap angkanya.',
  })
  asumsi() {
    return this.ekonomi.asumsiBerlaku();
  }

  @Public()
  @Get('ringkasan')
  @ApiOperation({
    summary: 'Rekap panen pada rentang tanggal',
    description:
      'Jumlah petani, petak, luas lahan, dan produktivitas tertimbang dari catatan panen.',
  })
  @ApiQuery({ name: 'dari', required: false, description: 'Tanggal awal, format YYYY-MM-DD' })
  @ApiQuery({ name: 'sampai', required: false, description: 'Tanggal akhir, format YYYY-MM-DD' })
  async ringkasan(@Query('dari') dari = DARI_BAWAAN, @Query('sampai') sampai = SAMPAI_BAWAAN) {
    const a = await this.ekonomi.asumsiBerlaku();
    return this.ekonomi.ringkasData(
      tanggal(dari, 'dari'),
      tanggal(sampai, 'sampai'),
      a.padukuhanPilot,
    );
  }

  @Public()
  @Get('dampak')
  @ApiOperation({
    summary: 'Perhitungan dampak ekonomi sebelum dan sesudah',
    description:
      'Kalkulasi kerugian hama, potensi penghematan, proyeksi replikasi, dan jejak langkah perhitungannya.',
  })
  @ApiQuery({ name: 'dari', required: false, description: 'Tanggal awal, format YYYY-MM-DD' })
  @ApiQuery({ name: 'sampai', required: false, description: 'Tanggal akhir, format YYYY-MM-DD' })
  dampak(@Query('dari') dari = DARI_BAWAAN, @Query('sampai') sampai = SAMPAI_BAWAAN) {
    return this.ekonomi.dampakEkonomi(tanggal(dari, 'dari'), tanggal(sampai, 'sampai'));
  }
}
