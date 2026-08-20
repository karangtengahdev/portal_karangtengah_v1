import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TrapsService {
  constructor(private prisma: PrismaService) {}

  // Daftar semua trap + event terkini masing-masing (untuk dashboard)
  async listWithLatest() {
    const traps = await this.prisma.device.findMany({
      where: { type: 'trap' },
      select: { deviceId: true, name: true, status: true },
    });
    return Promise.all(
      traps.map(async (t) => {
        const latest = await this.prisma.trapEvent.findFirst({
          where: { deviceId: t.deviceId },
          orderBy: { recordedAt: 'desc' },
        });
        return { ...t, latestEvent: latest };
      }),
    );
  }

  // Event terkini satu trap
  async latestOne(deviceId: string) {
    const ev = await this.prisma.trapEvent.findFirst({
      where: { deviceId },
      orderBy: { recordedAt: 'desc' },
    });
    if (!ev) throw new NotFoundException('Belum ada event untuk trap ini');
    return ev;
  }

  // Riwayat event satu trap (untuk grafik tren)
  async history(deviceId: string, limit = 50, eventType?: string) {
    const where: any = { deviceId };
    if (eventType) where.eventType = eventType;
    const items = await this.prisma.trapEvent.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
    return items.reverse(); // lama->baru, enak untuk grafik
  }

  // Ringkasan deteksi: total per eventType + deteksi hari ini
  async summary(deviceId?: string) {
    const where: any = {};
    if (deviceId) where.deviceId = deviceId;

    // total per eventType
    const grouped = await this.prisma.trapEvent.groupBy({
      by: ['eventType'],
      where,
      _count: { _all: true },
    });
    const byType: Record<string, number> = {};
    for (const g of grouped) byType[g.eventType] = g._count._all;

    // deteksi hama hari ini
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const pestToday = await this.prisma.trapEvent.count({
      where: { ...where, eventType: 'pest_detected', recordedAt: { gte: startToday } },
    });

    // total trap aktif
    const totalTraps = await this.prisma.device.count({ where: { type: 'trap' } });

    return {
      totalEvents: Object.values(byType).reduce((a, b) => a + b, 0),
      byType,
      pestDetectedToday: pestToday,
      totalTraps,
    };
  }
}
