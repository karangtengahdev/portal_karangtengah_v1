import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PlantingScheduleService } from './planting-schedule.service';

@ApiTags('public/planting-schedule')
@Controller('public/planting-schedule')
export class PlantingScheduleController {
  constructor(private readonly service: PlantingScheduleService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Daftar musim tanam publik',
    description:
      'Mengembalikan musim tanam beserta tahapan-tahapannya. ' +
      'Default hanya status AKTIF. Filter opsional: ?komoditasId=&status=',
  })
  @ApiQuery({ name: 'komoditasId', required: false, description: 'Filter berdasarkan ID komoditas' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'AKTIF', 'SELESAI'],
    description: 'Filter status (default: AKTIF)',
  })
  list(
    @Query('komoditasId') komoditasId?: string,
    @Query('status') status?: string,
  ) {
    return this.service.listPublic(komoditasId, status);
  }

  @Public()
  @Get('komoditas')
  @ApiOperation({
    summary: 'Daftar komoditas',
    description: 'List seluruh komoditas yang tersedia (untuk filter dropdown di frontend).',
  })
  listKomoditas() {
    return this.service.listKomoditas();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Detail musim tanam',
    description: 'Detail satu musim tanam beserta seluruh tahapan-tahapannya, diurutkan berdasarkan field urutan.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
