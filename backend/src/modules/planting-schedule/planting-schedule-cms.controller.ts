import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlantingScheduleService } from './planting-schedule.service';
import { CreateMusimTanamDto } from './dto/create-musim-tanam.dto';
import { UpdateMusimTanamDto } from './dto/update-musim-tanam.dto';
import { CreateTahapanDto } from './dto/create-tahapan.dto';
import { UpdateTahapanDto } from './dto/update-tahapan.dto';

// DTO inline untuk Komoditas (sederhana, tidak perlu file terpisah)
class CreateKomoditasDto {
  @ApiProperty({ example: 'Padi', description: 'Nama komoditas' })
  @IsString()
  nama: string;

  @ApiProperty({ example: 'Komoditas utama padi sawah', required: false })
  @IsOptional()
  @IsString()
  deskripsi?: string;
}

@ApiTags('cms/planting-schedule')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('cms/planting-schedule')
export class PlantingScheduleCmsController {
  constructor(private readonly service: PlantingScheduleService) {}

  // ──────────────────────────────────────────────────────────
  // MusimTanam
  // ──────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'Semua musim tanam (admin)',
    description: 'Mengembalikan semua musim tanam tanpa filter status. Filter opsional: ?komoditasId=&status=',
  })
  @ApiQuery({ name: 'komoditasId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'AKTIF', 'SELESAI'] })
  listAll(
    @Query('komoditasId') komoditasId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.listAll(komoditasId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail musim tanam (admin)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Buat musim tanam baru',
    description:
      'Membuat musim tanam baru. Opsional: sertakan array `tahapan` untuk membuat tahapan awal sekaligus. ' +
      'createdById diambil otomatis dari token JWT (tidak perlu di body).',
  })
  create(@Body() dto: CreateMusimTanamDto, @Req() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update musim tanam',
    description: 'Update data header musim tanam (judul, lokasi, status, dll). Untuk update tahapan gunakan endpoint /tahapan.',
  })
  update(@Param('id') id: string, @Body() dto: UpdateMusimTanamDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Hapus musim tanam',
    description: 'Hard delete musim tanam beserta seluruh tahapan-tahapannya (cascade).',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ──────────────────────────────────────────────────────────
  // TahapanJadwal — CRUD per tahapan
  // ──────────────────────────────────────────────────────────

  @Post(':musimTanamId/tahapan')
  @ApiOperation({
    summary: 'Tambah tahapan ke musim tanam',
    description: 'Menambahkan satu tahapan baru ke musim tanam yang sudah ada.',
  })
  createTahapan(
    @Param('musimTanamId') musimTanamId: string,
    @Body() dto: CreateTahapanDto,
  ) {
    return this.service.createTahapan(musimTanamId, dto);
  }

  @Put('tahapan/:id')
  @ApiOperation({ summary: 'Update tahapan jadwal' })
  updateTahapan(@Param('id') id: string, @Body() dto: UpdateTahapanDto) {
    return this.service.updateTahapan(id, dto);
  }

  @Delete('tahapan/:id')
  @ApiOperation({ summary: 'Hapus tahapan jadwal' })
  removeTahapan(@Param('id') id: string) {
    return this.service.removeTahapan(id);
  }

  // ──────────────────────────────────────────────────────────
  // Komoditas
  // ──────────────────────────────────────────────────────────

  @Post('komoditas')
  @ApiOperation({ summary: 'Buat komoditas baru' })
  @ApiBody({ type: CreateKomoditasDto })
  createKomoditas(@Body() body: CreateKomoditasDto) {
    return this.service.createKomoditas(body.nama, body.deskripsi);
  }

  @Put('komoditas/:id')
  @ApiOperation({ summary: 'Update komoditas' })
  @ApiBody({ type: CreateKomoditasDto })
  updateKomoditas(@Param('id') id: string, @Body() body: CreateKomoditasDto) {
    return this.service.updateKomoditas(id, body.nama, body.deskripsi);
  }

  @Delete('komoditas/:id')
  @ApiOperation({ summary: 'Hapus komoditas' })
  removeKomoditas(@Param('id') id: string) {
    return this.service.removeKomoditas(id);
  }
}
