import {
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../shared/storage/storage.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

// CMS - butuh role admin
@ApiTags('cms/news')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('portal')
@Controller('cms/news')
export class NewsCmsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  listAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.newsService.listAll(page ? +page : 1, limit ? +limit : 20);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.newsService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateNewsDto, @Req() req: any) {
    return this.newsService.create(dto, req.user?.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Post(':id/cover')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const dest = `news/${id}/cover.${ext}`;
    const result = await this.storage.upload(file.buffer, dest, file.mimetype);
    return this.newsService.setCover(id, result.url);
  }

  // Upload gambar utk DISISIPKAN DI DALAM isi berita (rich text editor) --
  // TERPISAH dari cover, tidak terikat ke satu id berita tertentu (dipakai
  // berkali-kali per artikel, bahkan sebelum artikelnya sendiri dibuat --
  // penulis bisa sisipkan gambar sambil masih mengetik draft).
  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInlineImage(@UploadedFile() file: any) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const nama = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dest = `news/content/${nama}`;
    const result = await this.storage.upload(file.buffer, dest, file.mimetype);
    return { url: result.url };
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string, @Body('publish') publish: boolean) {
    return this.newsService.publish(id, publish ?? true);
  }
}
