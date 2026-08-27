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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../shared/storage/storage.service';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UmkmService } from './umkm.service';
import { CreateUmkmDto } from './dto/create-umkm.dto';
import { UpdateUmkmDto } from './dto/update-umkm.dto';

@ApiTags('cms/umkm')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('portal')
@Controller('cms/umkm')
export class UmkmCmsController {
  constructor(
    private readonly umkmService: UmkmService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  listAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.umkmService.listAll(page ? +page : 1, limit ? +limit : 20);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.umkmService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateUmkmDto) {
    return this.umkmService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUmkmDto) {
    return this.umkmService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.umkmService.remove(id);
  }

  @Post(':id/cover')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const dest = `umkm/${id}/cover.${ext}`;
    const result = await this.storage.upload(file.buffer, dest, file.mimetype);
    return this.umkmService.setCover(id, result.url);
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string, @Body('publish') publish: boolean) {
    return this.umkmService.publish(id, publish ?? true);
  }
}
