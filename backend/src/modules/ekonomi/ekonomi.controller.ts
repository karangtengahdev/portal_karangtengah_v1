import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { EkonomiService } from './ekonomi.service';

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
  @ApiOperation({ summary: 'Asumsi perhitungan yang berlaku beserta sumbernya' })
  asumsi() {
    return this.ekonomi.asumsiBerlaku();
  }

  @Public()
  @Get('ringkasan')
  @ApiOperation({ summary: 'Rekap petani, petak, luas, dan produktivitas panen' })
  @ApiQuery({ name: 'dari', required: false, description: 'Tanggal awal, YYYY-MM-DD' })
  @ApiQuery({ name: 'sampai', required: false, description: 'Tanggal akhir, YYYY-MM-DD' })
  ringkasan(@Query('dari') dari = DARI_BAWAAN, @Query('sampai') sampai = SAMPAI_BAWAAN) {
    return this.ekonomi.ringkasData(tanggal(dari, 'dari'), tanggal(sampai, 'sampai'));
  }

  @Public()
  @Get('dampak')
  @ApiOperation({ summary: 'Perhitungan dampak ekonomi sebelum dan sesudah program' })
  @ApiQuery({ name: 'dari', required: false, description: 'Tanggal awal, YYYY-MM-DD' })
  @ApiQuery({ name: 'sampai', required: false, description: 'Tanggal akhir, YYYY-MM-DD' })
  dampak(@Query('dari') dari = DARI_BAWAAN, @Query('sampai') sampai = SAMPAI_BAWAAN) {
    return this.ekonomi.dampakEkonomi(tanggal(dari, 'dari'), tanggal(sampai, 'sampai'));
  }
}
