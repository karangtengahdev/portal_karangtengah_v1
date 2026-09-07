import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IngestDto } from './dto/ingest.dto';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  constructor(private prisma: PrismaService) {}

  // Pintu masuk semua data IoT dari Bridge. Simpan raw + routing by type.
  async ingest(dto: IngestDto) {
    const recordedAt = dto.recordedAt ? new Date(dto.recordedAt) : new Date();

    await this.prisma.device.upsert({
      where: { deviceId: dto.deviceId },
      update: { status: 'online', updatedAt: new Date() },
      create: {
        deviceId: dto.deviceId,
        type: dto.type === 'rover' ? 'rover' : dto.type === 'trap' ? 'trap' : 'bridge',
        status: 'online',
      },
    });

    await this.prisma.telemetry.create({
      data: { deviceId: dto.deviceId, payload: dto as any, recordedAt },
    });

    if (dto.type === 'rover') {
      const d = dto.data;
      await this.prisma.roverOperation.create({
        data: {
          deviceId: dto.deviceId,
          lat: d.lat ?? null,
          lng: d.lng ?? null,
          heading: d.heading ?? null,
          gpsFix: d.gpsFix ?? null,
          sats: d.sats ?? null,
          status: d.status ?? null,
          recordedAt,
        },
      });
    } else if (dto.type === 'trap') {
      await this.prisma.trapEvent.create({
        data: {
          deviceId: dto.deviceId,
          eventType: dto.data.eventType ?? 'status',
          data: dto.data as any,
          recordedAt,
        },
      });
    }

    return { received: true, deviceId: dto.deviceId, type: dto.type, recordedAt };
  }

  // BARU: baca balik data mentah -- utk verifikasi tim teknis apakah
  // data dari Bridge memang benar sudah masuk, tanpa perlu buka
  // database langsung. Ini baca tabel Telemetry (raw/audit trail),
  // BUKAN tabel RoverOperation/TrapEvent yg sudah diproses.
  async listRecent(limit = 50, deviceId?: string) {
    const where: any = {};
    if (deviceId) where.deviceId = deviceId;
    return this.prisma.telemetry.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
  }
}
