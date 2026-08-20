import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  private slugify(title: string): string {
    return title
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
    // pastikan slug unik
    while (true) {
      const existing = await this.prisma.news.findUnique({ where: { slug } });
      if (!existing || existing.id === ignoreId) break;
      slug = `${base}-${n++}`;
    }
    return slug;
  }

  // ---------- PUBLIK (read-only, hanya published) ----------
  async listPublished(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverUrl: true,
          publishedAt: true,
        },
      }),
      this.prisma.news.count({ where: { status: 'published' } }),
    ]);
    return { items, total, page, limit };
  }

  async getPublishedBySlug(slug: string) {
    const news = await this.prisma.news.findFirst({
      where: { slug, status: 'published' },
    });
    if (!news) throw new NotFoundException('Berita tidak ditemukan');
    return news;
  }

  // ---------- CMS (admin) ----------
  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.news.count(),
    ]);
    return { items, total, page, limit };
  }

  async getById(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('Berita tidak ditemukan');
    return news;
  }

  async create(dto: CreateNewsDto, authorId?: string) {
    const slug = await this.uniqueSlug(this.slugify(dto.title));
    // authorId hanya dipakai kalau user-nya ADA di tabel profiles (hindari FK error).
    let safeAuthorId: string | undefined = undefined;
    if (authorId) {
      const prof = await this.prisma.profile.findUnique({ where: { id: authorId } });
      safeAuthorId = prof ? authorId : undefined;
    }
    // Strip field UI-only (category, author) yang tidak ada di schema DB
    const { category: _cat, author: _aut, ...prismaData } = dto;
    return this.prisma.news.create({
      data: { ...prismaData, slug, authorId: safeAuthorId },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.getById(id);
    // Strip field UI-only (category, author) yang tidak ada di schema DB
    const { category: _cat, author: _aut, ...rest } = dto;
    const data: any = { ...rest };
    if (dto.title) {
      data.slug = await this.uniqueSlug(this.slugify(dto.title), id);
    }
    return this.prisma.news.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.news.delete({ where: { id } });
    return { id, deleted: true };
  }

  async publish(id: string, publish: boolean) {
    await this.getById(id);
    return this.prisma.news.update({
      where: { id },
      data: {
        status: publish ? 'published' : 'draft',
        publishedAt: publish ? new Date() : null,
      },
    });
  }

  async setCover(id: string, coverUrl: string) {
    await this.getById(id);
    return this.prisma.news.update({ where: { id }, data: { coverUrl } });
  }
}
