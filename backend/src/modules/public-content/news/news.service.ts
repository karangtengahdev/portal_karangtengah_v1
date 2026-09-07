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
          category: true,
          author: true,
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

  // PENTING: dto DISPREAD APA ADANYA, TIDAK ADA field category/author
  // yang dibuang di sini. Kalau versi yang jalan sekarang di server
  // Anda MASIH punya baris semacam:
  //   const { category: _cat, author: _aut, ...prismaData } = dto;
  // itu tandanya file lama yang masih ke-deploy -- ganti dgn versi ini.
  async create(dto: CreateNewsDto, authorId?: string) {
    const slug = await this.uniqueSlug(this.slugify(dto.title));
    let safeAuthorId: string | undefined = undefined;
    if (authorId) {
      const prof = await this.prisma.profile.findUnique({ where: { id: authorId } });
      safeAuthorId = prof ? authorId : undefined;
    }
    return this.prisma.news.create({
      data: { ...dto, slug, authorId: safeAuthorId },
    });
  }

  // SAMA PENTINGNYA: update() juga TIDAK BOLEH buang category/author.
  // Ini yang paling mungkin jadi penyebab bug Anda -- kalau versi lama
  // masih ke-deploy di sini, isi Penulis yang Anda ketik saat EDIT
  // akan hilang lagi walau sudah benar diketik di form.
  async update(id: string, dto: UpdateNewsDto) {
    await this.getById(id);
    const data: any = { ...dto };
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
