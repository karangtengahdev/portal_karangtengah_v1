import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePadukuhanDto } from './dto/create-padukuhan.dto';
import { UpdatePadukuhanDto } from './dto/update-padukuhan.dto';
import { CreatePadukuhanGalleryDto } from './dto/gallery.dto';

const GALLERY_INCLUDE = { gallery: { orderBy: { orderIndex: 'asc' as const } } };

@Injectable()
export class PadukuhanService {
  constructor(private prisma: PrismaService) {}

  // ---------- PUBLIK ----------
  async listPublic() {
    return this.prisma.padukuhan.findMany({
      orderBy: { orderIndex: 'asc' },
      include: GALLERY_INCLUDE,
    });
  }

  async getPublicByName(name: string) {
    const item = await this.prisma.padukuhan.findUnique({
      where: { name },
      include: GALLERY_INCLUDE,
    });
    if (!item) throw new NotFoundException('Padukuhan tidak ditemukan');
    return item;
  }

  // ---------- CMS ----------
  async listAll() {
    return this.prisma.padukuhan.findMany({
      orderBy: { orderIndex: 'asc' },
      include: GALLERY_INCLUDE,
    });
  }

  async getById(id: string) {
    const item = await this.prisma.padukuhan.findUnique({
      where: { id },
      include: GALLERY_INCLUDE,
    });
    if (!item) throw new NotFoundException('Padukuhan tidak ditemukan');
    return item;
  }

  async create(dto: CreatePadukuhanDto) {
    return this.prisma.padukuhan.create({ data: dto });
  }

  async update(id: string, dto: UpdatePadukuhanDto) {
    await this.getById(id);
    return this.prisma.padukuhan.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.padukuhan.delete({ where: { id } });
    return { id, deleted: true };
  }

  async addGallery(padukuhanId: string, dto: CreatePadukuhanGalleryDto) {
    await this.getById(padukuhanId);
    return this.prisma.padukuhanGallery.create({
      data: { ...dto, padukuhanId },
    });
  }

  async removeGallery(galleryId: string) {
    await this.prisma.padukuhanGallery.delete({ where: { id: galleryId } });
    return { id: galleryId, deleted: true };
  }
}
