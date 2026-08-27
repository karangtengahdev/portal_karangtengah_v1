import {
  Body, Controller, Delete, Get, Param, Post, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

@ApiTags('cms/harvest')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Roles('nawasena')
@Controller('cms/harvest')
export class HarvestCmsController {
  constructor(private readonly harvestService: HarvestService) {}

  @Get()
  @ApiOperation({ summary: 'Semua data panen (admin)' })
  listAll() { return this.harvestService.listAll(); }

  @Get(':id')
  getById(@Param('id') id: string) { return this.harvestService.getById(id); }

  @Post()
  @ApiOperation({ summary: 'Input data panen', description: 'Yield ton/ha & estimasi total dihitung otomatis dari ubinan (faktor BPS 1.6). Jika scheduleId diisi, jadwal ditandai harvested.' })
  create(@Body() dto: CreateHarvestDto) { return this.harvestService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHarvestDto) {
    return this.harvestService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.harvestService.remove(id); }
}
