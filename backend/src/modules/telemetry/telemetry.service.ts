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

    // 1. Pastikan device ADA dulu (telemetry punya FK ke device).
    await this.prisma.device.upsert({
      where: { deviceId: dto.deviceId },
      update: { status: 'online', updatedAt: new Date() },
      create: {
        deviceId: dto.deviceId,
        type: dto.type === 'rover' ? 'rover' : dto.type === 'trap' ? 'trap' : 'bridge',
        status: 'online',
      },
    });

    // 2. Baru simpan raw (audit trail semua paket)
    await this.prisma.telemetry.create({
      data: { deviceId: dto.deviceId, payload: dto as any, recordedAt },
    });

    // 3. Routing by type
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
}
