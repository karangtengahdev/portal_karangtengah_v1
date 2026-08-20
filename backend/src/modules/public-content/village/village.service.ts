import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateVillageDto } from './dto/update-village.dto';
import { CreateGalleryDto } from './dto/gallery.dto';

@Injectable()
export class VillageService {
  constructor(private prisma: PrismaService) {}

  // Singleton: ambil profil (buat default kalau belum ada)
  async getProfile() {
    let profile = await this.prisma.villageProfile.findFirst();
    if (!profile) {
      profile = await this.prisma.villageProfile.create({ data: {} });
    }
    const gallery = await this.prisma.villageGallery.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return { ...profile, gallery };
  }

  async updateProfile(dto: UpdateVillageDto) {
    const existing = await this.prisma.villageProfile.findFirst();
    if (!existing) {
      return this.prisma.villageProfile.create({ data: dto as any });
    }
    return this.prisma.villageProfile.update({
      where: { id: existing.id },
      data: dto as any,
    });
  }

  async addGallery(dto: CreateGalleryDto) {
    return this.prisma.villageGallery.create({ data: dto });
  }

  async removeGallery(id: string) {
    await this.prisma.villageGallery.delete({ where: { id } });
    return { id, deleted: true };
  }
}
