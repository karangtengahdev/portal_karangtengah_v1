import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUmkmDto } from './dto/create-umkm.dto';
import { UpdateUmkmDto } from './dto/update-umkm.dto';

@Injectable()
export class UmkmService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  }

  private async uniqueSlug(base: string, ignoreId?: string): Promise<string> {
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await this.prisma.umkm.findUnique({ where: { slug } });
      if (!existing || existing.id === ignoreId) break;
      slug = `${base}-${n++}`;
    }
    return slug;
  }

  // ---------- PUBLIK ----------
  async listPublished(page = 1, limit = 12, category?: string) {
    const skip = (page - 1) * limit;
    const where: any = { status: 'published' };
    if (category) where.category = category;
    const [items, total] = await Promise.all([
      this.prisma.umkm.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          ownerName: true,
          category: true,
          coverUrl: true,
          contactPhone: true,
        },
      }),
      this.prisma.umkm.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async getPublishedBySlug(slug: string) {
    const umkm = await this.prisma.umkm.findFirst({
      where: { slug, status: 'published' },
    });
    if (!umkm) throw new NotFoundException('UMKM tidak ditemukan');
    return umkm;
  }

  // ---------- CMS ----------
  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.umkm.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.umkm.count(),
    ]);
    return { items, total, page, limit };
  }

  async getById(id: string) {
    const umkm = await this.prisma.umkm.findUnique({ where: { id } });
    if (!umkm) throw new NotFoundException('UMKM tidak ditemukan');
    return umkm;
  }

  async create(dto: CreateUmkmDto) {
    const slug = await this.uniqueSlug(this.slugify(dto.name));
    return this.prisma.umkm.create({
      data: { ...dto, slug, products: (dto.products ?? []) as any },
    });
  }

  async update(id: string, dto: UpdateUmkmDto) {
    await this.getById(id);
    const data: any = { ...dto };
    if (dto.name) data.slug = await this.uniqueSlug(this.slugify(dto.name), id);
    if (dto.products) data.products = dto.products as any;
    return this.prisma.umkm.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.umkm.delete({ where: { id } });
    return { id, deleted: true };
  }

  async publish(id: string, publish: boolean) {
    await this.getById(id);
    return this.prisma.umkm.update({
      where: { id },
      data: { status: publish ? 'published' : 'draft' },
    });
  }

  async setCover(id: string, coverUrl: string) {
    await this.getById(id);
    return this.prisma.umkm.update({ where: { id }, data: { coverUrl } });
  }
}
