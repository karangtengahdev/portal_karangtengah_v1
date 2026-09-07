import {
  Body, Controller, Delete, Get, Param, Post, Put, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../shared/storage/storage.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PadukuhanService } from './padukuhan.service';
import { CreatePadukuhanDto } from './dto/create-padukuhan.dto';
import { UpdatePadukuhanDto } from './dto/update-padukuhan.dto';

// Role 'portal' -- pengelolaan konten padukuhan/profil desa memang
// domain Portal (pemuda), sama seperti Berita/UMKM/Village.
@ApiTags('cms/padukuhan')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('portal')
@Controller('cms/padukuhan')
export class PadukuhanCmsController {
  constructor(
    private readonly service: PadukuhanService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  listAll() {
    return this.service.listAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() dto: CreatePadukuhanDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePadukuhanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/gallery/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGallery(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body('caption') caption?: string,
    @Body('orderIndex') orderIndex?: string,
  ) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const dest = `padukuhan/${id}/${Date.now()}.${ext}`;
    const result = await this.storage.upload(file.buffer, dest, file.mimetype);
    return this.service.addGallery(id, {
      imageUrl: result.url,
      caption,
      orderIndex: orderIndex ? +orderIndex : 0,
    });
  }

  @Delete('gallery/:galleryId')
  removeGallery(@Param('galleryId') galleryId: string) {
    return this.service.removeGallery(galleryId);
  }
}
