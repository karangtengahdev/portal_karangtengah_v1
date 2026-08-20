import {
  Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('cms/schedule')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('cms/schedule')
export class ScheduleCmsController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'Semua jadwal tanam (admin)' })
  listAll() { return this.scheduleService.listAll(); }

  @Get('upcoming-harvest')
  @ApiOperation({ summary: 'Jadwal mendekati panen', description: 'Default 7 hari ke depan. ?days=' })
  upcoming(@Query('days') days?: string) {
    return this.scheduleService.upcomingHarvest(days ? +days : 7);
  }

  @Get(':id')
  getById(@Param('id') id: string) { return this.scheduleService.getById(id); }

  @Post()
  @ApiOperation({ summary: 'Tambah jadwal tanam', description: 'Estimasi panen otomatis jika tidak diisi (default umur padi 115 hari).' })
  create(@Body() dto: CreateScheduleDto) { return this.scheduleService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.scheduleService.remove(id); }
}
