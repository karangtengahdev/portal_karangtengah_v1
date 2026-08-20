import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMusimTanamDto } from './dto/create-musim-tanam.dto';
import { UpdateMusimTanamDto } from './dto/update-musim-tanam.dto';
import { CreateTahapanDto } from './dto/create-tahapan.dto';
import { UpdateTahapanDto } from './dto/update-tahapan.dto';

// Include shape yang dipakai di banyak tempat
const MUSIM_TANAM_INCLUDE = {
  komoditas: { select: { id: true, nama: true, deskripsi: true } },
  createdBy: { select: { id: true, fullName: true, email: true } },
  tahapan: { orderBy: { urutan: 'asc' as const } },
};

@Injectable()
export class PlantingScheduleService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────
  // PUBLIC
  // ──────────────────────────────────────────────────────────

  /**
   * List musim tanam untuk tampilan publik.
   * Default: hanya status AKTIF. Admin bisa lihat semua via CMS.
   * Filter opsional: komoditasId, status (untuk CMS listAll).
   */
  async listPublic(komoditasId?: string, status?: string) {
    const where: any = {
      // Default tampilkan AKTIF kalau tidak ada filter status
      status: status ?? 'AKTIF',
    };
    if (komoditasId) where.komoditasId = komoditasId;

    return this.prisma.musimTanam.findMany({
      where,
      orderBy: { tanggalMulai: 'asc' },
      include: MUSIM_TANAM_INCLUDE,
    });
  }

  /**
   * Detail satu musim tanam beserta tahapan-tahapannya.
   * Dipakai baik oleh endpoint publik maupun CMS.
   */
  async findOne(id: string) {
    const item = await this.prisma.musimTanam.findUnique({
      where: { id },
      include: MUSIM_TANAM_INCLUDE,
    });
    if (!item) throw new NotFoundException('Musim tanam tidak ditemukan');
    return item;
  }

  // ──────────────────────────────────────────────────────────
  // CMS – MusimTanam CRUD
  // ──────────────────────────────────────────────────────────

  /** Semua musim tanam (tanpa filter status), untuk halaman admin. */
  async listAll(komoditasId?: string, status?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (komoditasId) where.komoditasId = komoditasId;

    return this.prisma.musimTanam.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: MUSIM_TANAM_INCLUDE,
    });
  }

  async create(dto: CreateMusimTanamDto, createdById?: string) {
    const { tahapan, tanggalMulai, tanggalSelesai, ...rest } = dto;

    // Verifikasi komoditas ada
    const komoditas = await this.prisma.komoditas.findUnique({
      where: { id: rest.komoditasId },
    });
    if (!komoditas) throw new NotFoundException('Komoditas tidak ditemukan');

    // Guard: createdById hanya dipakai kalau profilnya ada di DB (hindari FK error)
    let safeCreatedById: string | undefined;
    if (createdById) {
      const prof = await this.prisma.profile.findUnique({ where: { id: createdById } });
      safeCreatedById = prof ? createdById : undefined;
    }

    return this.prisma.musimTanam.create({
      data: {
        ...rest,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
        createdById: safeCreatedById,
        // Buat tahapan sekaligus jika disertakan di body
        tahapan: tahapan?.length
          ? {
              create: tahapan.map((t) => ({
                namaTahapan: t.namaTahapan,
                tanggalMulai: new Date(t.tanggalMulai),
                tanggalSelesai: t.tanggalSelesai ? new Date(t.tanggalSelesai) : undefined,
                urutan: t.urutan,
                deskripsi: t.deskripsi,
              })),
            }
          : undefined,
      },
      include: MUSIM_TANAM_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateMusimTanamDto) {
    // pastikan ada
    await this.findOne(id);

    const { tahapan, tanggalMulai, tanggalSelesai, ...rest } = dto;

    // Verifikasi komoditas jika ganti
    if (rest.komoditasId) {
      const komoditas = await this.prisma.komoditas.findUnique({
        where: { id: rest.komoditasId },
      });
      if (!komoditas) throw new NotFoundException('Komoditas tidak ditemukan');
    }

    return this.prisma.musimTanam.update({
      where: { id },
      data: {
        ...rest,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
      },
      include: MUSIM_TANAM_INCLUDE,
    });
  }

  async remove(id: string) {
    // findOne melempar NotFoundException jika tidak ada
    await this.findOne(id);
    // onDelete: Cascade sudah diset di schema — TahapanJadwal ikut terhapus
    await this.prisma.musimTanam.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ──────────────────────────────────────────────────────────
  // CMS – TahapanJadwal CRUD
  // ──────────────────────────────────────────────────────────

  async createTahapan(musimTanamId: string, dto: CreateTahapanDto) {
    // Pastikan musim tanam induknya ada
    await this.findOne(musimTanamId);

    return this.prisma.tahapanJadwal.create({
      data: {
        musimTanamId,
        namaTahapan: dto.namaTahapan,
        tanggalMulai: new Date(dto.tanggalMulai),
        tanggalSelesai: dto.tanggalSelesai ? new Date(dto.tanggalSelesai) : undefined,
        urutan: dto.urutan,
        deskripsi: dto.deskripsi,
      },
    });
  }

  async updateTahapan(id: string, dto: UpdateTahapanDto) {
    const tahapan = await this.prisma.tahapanJadwal.findUnique({ where: { id } });
    if (!tahapan) throw new NotFoundException('Tahapan jadwal tidak ditemukan');

    const { tanggalMulai, tanggalSelesai, ...rest } = dto;

    return this.prisma.tahapanJadwal.update({
      where: { id },
      data: {
        ...rest,
        tanggalMulai: tanggalMulai ? new Date(tanggalMulai) : undefined,
        tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai) : undefined,
      },
    });
  }

  async removeTahapan(id: string) {
    const tahapan = await this.prisma.tahapanJadwal.findUnique({ where: { id } });
    if (!tahapan) throw new NotFoundException('Tahapan jadwal tidak ditemukan');

    await this.prisma.tahapanJadwal.delete({ where: { id } });
    return { id, deleted: true };
  }

  // ──────────────────────────────────────────────────────────
  // Komoditas — CRUD ringan (admin)
  // ──────────────────────────────────────────────────────────

  async listKomoditas() {
    return this.prisma.komoditas.findMany({ orderBy: { nama: 'asc' } });
  }

  async createKomoditas(nama: string, deskripsi?: string) {
    return this.prisma.komoditas.create({ data: { nama, deskripsi } });
  }

  async updateKomoditas(id: string, nama?: string, deskripsi?: string) {
    const exists = await this.prisma.komoditas.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Komoditas tidak ditemukan');
    return this.prisma.komoditas.update({
      where: { id },
      data: { nama, deskripsi },
    });
  }

  async removeKomoditas(id: string) {
    const exists = await this.prisma.komoditas.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Komoditas tidak ditemukan');
    await this.prisma.komoditas.delete({ where: { id } });
    return { id, deleted: true };
  }
}
