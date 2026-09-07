import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PadukuhanService } from './padukuhan.service';

@ApiTags('public/padukuhan')
@Controller('public/padukuhan')
export class PadukuhanController {
  constructor(private readonly service: PadukuhanService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Daftar semua padukuhan', description: 'Termasuk yang belum ada data (hasData: false) -- frontend tampilkan "Segera Hadir" utk itu.' })
  list() {
    return this.service.listPublic();
  }

  @Public()
  @Get(':name')
  @ApiOperation({ summary: 'Detail satu padukuhan berdasarkan nama' })
  getByName(@Param('name') name: string) {
    return this.service.getPublicByName(name);
  }
}
