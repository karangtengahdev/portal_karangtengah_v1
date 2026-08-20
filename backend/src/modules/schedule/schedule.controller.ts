import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ScheduleService } from './schedule.service';

@ApiTags('public/schedule')
@Controller('public/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Daftar jadwal tanam desa', description: 'Filter ?padukuhan= dan ?status=planned|planted|harvested' })
  list(@Query('padukuhan') padukuhan?: string, @Query('status') status?: string) {
    return this.scheduleService.listPublic(padukuhan, status);
  }

  @Public()
  @Get('by-padukuhan')
  @ApiOperation({ summary: 'Jadwal dikelompokkan per padukuhan', description: 'Untuk lihat tanam serentak per wilayah.' })
  byPadukuhan() {
    return this.scheduleService.groupByPadukuhan();
  }
}
