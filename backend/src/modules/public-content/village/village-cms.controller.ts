import {
  Body, Controller, Delete, Param, Post, Put, UseGuards,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../shared/storage/storage.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { VillageService } from './village.service';
import { UpdateVillageDto } from './dto/update-village.dto';
import { CreateGalleryDto } from './dto/gallery.dto';

@ApiTags('cms/village')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('cms/village')
export class VillageCmsController {
  constructor(
    private readonly villageService: VillageService,
    private readonly storage: StorageService,
  ) {}

  @Put()
  update(@Body() dto: UpdateVillageDto) {
    return this.villageService.updateProfile(dto);
  }

  @Post('gallery')
  addGallery(@Body() dto: CreateGalleryDto) {
    return this.villageService.addGallery(dto);
  }

  @Post('gallery/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGallery(
    @UploadedFile() file: any,
    @Body('caption') caption?: string,
    @Body('orderIndex') orderIndex?: string,
  ) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const dest = `village/${Date.now()}.${ext}`;
    const result = await this.storage.upload(file.buffer, dest, file.mimetype);
    return this.villageService.addGallery({
      imageUrl: result.url,
      caption,
      orderIndex: orderIndex ? +orderIndex : 0,
    });
  }

  @Delete('gallery/:id')
  removeGallery(@Param('id') id: string) {
    return this.villageService.removeGallery(id);
  }
}
