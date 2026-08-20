import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { UmkmService } from './umkm.service';

@ApiTags('public/umkm')
@Controller('public/umkm')
export class UmkmController {
  constructor(private readonly umkmService: UmkmService) {}

  @Public()
  @Get()
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    return this.umkmService.listPublished(
      page ? +page : 1,
      limit ? +limit : 12,
      category,
    );
  }

  @Public()
  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.umkmService.getPublishedBySlug(slug);
  }
}
