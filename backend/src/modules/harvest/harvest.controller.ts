import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { HarvestService } from './harvest.service';

@ApiTags('public/harvest')
@Controller('public/harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Rekap panen desa', description: 'Daftar hasil panen. Filter ?padukuhan=' })
  list(@Query('padukuhan') padukuhan?: string) {
    return this.harvestService.listPublic(padukuhan);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Statistik panen desa', description: 'Rata-rata yield ton/ha, total produksi, rata-rata kerusakan hama, per padukuhan.' })
  stats() {
    return this.harvestService.stats();
  }
}
