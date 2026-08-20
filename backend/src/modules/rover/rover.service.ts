import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoverService {
  constructor(private prisma: PrismaService) {}

  // Posisi terkini SEMUA rover (untuk tampil banyak marker di maps)
  async latestAll() {
    const rovers = await this.prisma.device.findMany({
      where: { type: 'rover' },
      select: { deviceId: true, status: true, name: true },
    });
    // ambil posisi terkini tiap rover secara paralel (typed, tanpa never[])
    return Promise.all(
      rovers.map(async (r) => {
        const position = await this.prisma.roverOperation.findFirst({
          where: { deviceId: r.deviceId },
          orderBy: { recordedAt: 'desc' },
        });
        return { ...r, position };
      }),
    );
  }

  // Posisi terkini SATU rover
  async latestOne(deviceId: string) {
    const pos = await this.prisma.roverOperation.findFirst({
      where: { deviceId },
      orderBy: { recordedAt: 'desc' },
    });
    if (!pos) throw new NotFoundException('Belum ada data posisi untuk rover ini');
    return pos;
  }

  // Jejak posisi (riwayat) untuk gambar rute di maps
  async track(deviceId: string, limit = 50) {
    const items = await this.prisma.roverOperation.findMany({
      where: { deviceId },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
    // balik urutan jadi lama->baru (enak untuk polyline)
    return items.reverse();
  }
}
