import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

// Faktor konversi ubinan BPS:
// Petak ubinan 2.5m x 2.5m = 6.25 m2. Dalam 1 hektar (10.000 m2) ada
// 10000 / 6.25 = 1600 petak. Jadi yield (kg/ha) = ubinanKg * 1600.
// Dalam ton/ha = ubinanKg * 1600 / 1000 = ubinanKg * 1.6
const FAKTOR_UBINAN_TON_HA = 1.6;

@Injectable()
export class HarvestService {
  constructor(private prisma: PrismaService) {}

  private hitung(ubinanKg: number, areaHa: number) {
    const yieldTonHa = +(ubinanKg * FAKTOR_UBINAN_TON_HA).toFixed(3);
    // estimasi total produksi lahan petani (kg) = yield ton/ha * 1000 * luas ha
    const estimatedKg = +(yieldTonHa * 1000 * areaHa).toFixed(2);
    return { yieldTonHa, estimatedKg };
  }

  // ---------- PUBLIK (rekap) ----------
  async listPublic(padukuhan?: string) {
    const where: any = {};
    if (padukuhan) where.padukuhan = padukuhan;
    return this.prisma.harvestRecord.findMany({
      where,
      orderBy: { harvestDate: 'desc' },
      select: {
        id: true, farmerName: true, fieldName: true, padukuhan: true,
        yieldTonHa: true, harvestDate: true, pestLossPct: true,
      },
    });
  }

  // Statistik agregat desa
  async stats() {
    const all = await this.prisma.harvestRecord.findMany();
    if (all.length === 0) {
      return { totalRecords: 0, avgYieldTonHa: 0, totalEstimatedKg: 0, avgPestLossPct: 0, byPadukuhan: [] };
    }
    const avg = (arr: number[]) =>
      arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(3) : 0;

    const yields = all.map((h) => h.yieldTonHa ?? 0);
    const losses = all.filter((h) => h.pestLossPct != null).map((h) => h.pestLossPct as number);
    const totalEst = all.reduce((a, h) => a + (h.estimatedKg ?? 0), 0);

    // grup per padukuhan
    const groups: Record<string, number[]> = {};
    for (const h of all) {
      const key = h.padukuhan || 'Tanpa Padukuhan';
      (groups[key] ||= []).push(h.yieldTonHa ?? 0);
    }
    const byPadukuhan = Object.entries(groups).map(([padukuhan, ys]) => ({
      padukuhan, count: ys.length, avgYieldTonHa: avg(ys),
    }));

    return {
      totalRecords: all.length,
      avgYieldTonHa: avg(yields),
      totalEstimatedKg: +totalEst.toFixed(2),
      avgPestLossPct: avg(losses),
      byPadukuhan,
    };
  }

  // ---------- CMS ----------
  async listAll() {
    return this.prisma.harvestRecord.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    const h = await this.prisma.harvestRecord.findUnique({ where: { id } });
    if (!h) throw new NotFoundException('Data panen tidak ditemukan');
    return h;
  }

  async create(dto: CreateHarvestDto) {
    const { yieldTonHa, estimatedKg } = this.hitung(dto.ubinanKg, dto.areaHa);

    // Validasi scheduleId: harus UUID valid, jika kosong/tidak valid → undefined
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const safeScheduleId =
      dto.scheduleId && UUID_RE.test(dto.scheduleId) ? dto.scheduleId : undefined;

    const rec = await this.prisma.harvestRecord.create({
      data: {
        farmerName: dto.farmerName,
        fieldName: dto.fieldName,
        padukuhan: dto.padukuhan,
        ubinanKg: dto.ubinanKg,
        areaHa: dto.areaHa,
        yieldTonHa,
        estimatedKg,
        pestLossPct: dto.pestLossPct,
        scheduleId: safeScheduleId,
        harvestDate: new Date(dto.harvestDate),
      },
    });
    // kalau ada link jadwal, tandai jadwal jadi harvested
    if (safeScheduleId) {
      await this.prisma.fieldSchedule
        .update({ where: { id: safeScheduleId }, data: { status: 'harvested' } })
        .catch(() => null); // abaikan kalau jadwal tidak ada
    }
    return rec;
  }

  async update(id: string, dto: UpdateHarvestDto) {
    await this.getById(id);
    const data: any = { ...dto };
    if (dto.harvestDate) data.harvestDate = new Date(dto.harvestDate);
    // recalc kalau ubinan/area berubah
    if (dto.ubinanKg != null || dto.areaHa != null) {
      const current = await this.getById(id);
      const ubinan = dto.ubinanKg ?? current.ubinanKg;
      const area = dto.areaHa ?? current.areaHa;
      const { yieldTonHa, estimatedKg } = this.hitung(ubinan, area);
      data.yieldTonHa = yieldTonHa;
      data.estimatedKg = estimatedKg;
    }
    return this.prisma.harvestRecord.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.harvestRecord.delete({ where: { id } });
    return { id, deleted: true };
  }
}
