import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { NewsService } from './news.service';

// PUBLIK - tanpa auth, hanya berita published
@ApiTags('public/news')
@Controller('public/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  list(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.newsService.listPublished(
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.newsService.getPublishedBySlug(slug);
  }
}
