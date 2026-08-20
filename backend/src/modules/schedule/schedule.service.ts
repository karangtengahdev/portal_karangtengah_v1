import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // Hitung estimasi panen dari tanggal tanam + umur padi (default 115 hari)
  private calcHarvest(plantDate: Date, cropDays = 115): Date {
    const d = new Date(plantDate);
    d.setDate(d.getDate() + cropDays);
    return d;
  }

  // ---------- PUBLIK ----------
  async listPublic(padukuhan?: string, status?: string) {
    const where: any = {};
    if (padukuhan) where.padukuhan = padukuhan;
    if (status) where.status = status;
    const items = await this.prisma.fieldSchedule.findMany({
      where,
      orderBy: { plantDate: 'asc' },
      select: {
        id: true, farmerName: true, fieldName: true, padukuhan: true,
        plantDate: true, estimatedHarvest: true, status: true,
      },
    });
    return items;
  }

  // Tanam serentak: kelompokkan per padukuhan
  async groupByPadukuhan() {
    const all = await this.prisma.fieldSchedule.findMany({
      orderBy: { plantDate: 'asc' },
    });
    const groups: Record<string, any[]> = {};
    for (const s of all) {
      const key = s.padukuhan || 'Tanpa Padukuhan';
      (groups[key] ||= []).push(s);
    }
    return Object.entries(groups).map(([padukuhan, schedules]) => ({
      padukuhan,
      total: schedules.length,
      schedules,
    }));
  }

  // ---------- CMS ----------
  async listAll() {
    return this.prisma.fieldSchedule.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    const s = await this.prisma.fieldSchedule.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Jadwal tidak ditemukan');
    return s;
  }

  async create(dto: CreateScheduleDto) {
    const plantDate = new Date(dto.plantDate);
    const estimatedHarvest = dto.estimatedHarvest
      ? new Date(dto.estimatedHarvest)
      : this.calcHarvest(plantDate, dto.cropDays);
    return this.prisma.fieldSchedule.create({
      data: {
        farmerName: dto.farmerName,
        fieldName: dto.fieldName,
        padukuhan: dto.padukuhan,
        plantDate,
        estimatedHarvest,
        notes: dto.notes,
      },
    });
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.getById(id);
    const data: any = { ...dto };
    delete data.cropDays;
    if (dto.plantDate) {
      data.plantDate = new Date(dto.plantDate);
      // recalc estimasi kalau plantDate berubah & estimatedHarvest tidak diisi manual
      if (!dto.estimatedHarvest) {
        data.estimatedHarvest = this.calcHarvest(data.plantDate, dto.cropDays);
      }
    }
    if (dto.estimatedHarvest) data.estimatedHarvest = new Date(dto.estimatedHarvest);
    return this.prisma.fieldSchedule.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.fieldSchedule.delete({ where: { id } });
    return { id, deleted: true };
  }

  // Jadwal mendekati panen (untuk basis notifikasi nanti)
  async upcomingHarvest(days = 7) {
    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);
    return this.prisma.fieldSchedule.findMany({
      where: {
        status: { not: 'harvested' },
        estimatedHarvest: { gte: now, lte: until },
      },
      orderBy: { estimatedHarvest: 'asc' },
    });
  }
}
