import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
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

@Controller('ekonomi')
export class EkonomiController {
  constructor(private readonly ekonomi: EkonomiService) {}

  /** Asumsi perhitungan yang sedang berlaku beserta sumbernya. */
  @Get('asumsi')
  asumsi() {
    return this.ekonomi.asumsiBerlaku();
  }

  /** Rekap petani, petak, dan produktivitas pada rentang tanggal panen. */
  @Get('ringkasan')
  async ringkasan(
    @Query('dari') dari = DARI_BAWAAN,
    @Query('sampai') sampai = SAMPAI_BAWAAN,
  ) {
    const a = await this.ekonomi.asumsiBerlaku();
    return this.ekonomi.ringkasData(
      tanggal(dari, 'dari'),
      tanggal(sampai, 'sampai'),
      a.padukuhanPilot,
    );
  }

  /** Perhitungan sebelum–sesudah lengkap dengan proyeksi replikasi. */
  @Get('dampak')
  dampak(@Query('dari') dari = DARI_BAWAAN, @Query('sampai') sampai = SAMPAI_BAWAAN) {
    return this.ekonomi.dampakEkonomi(tanggal(dari, 'dari'), tanggal(sampai, 'sampai'));
  }
}
