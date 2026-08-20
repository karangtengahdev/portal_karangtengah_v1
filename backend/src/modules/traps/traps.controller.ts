import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TrapsService } from './traps.service';

// Monitoring trap hama - PUBLIK read-only (polling dari web).
@ApiTags('public/traps')
@Controller('public/traps')
export class TrapsController {
  constructor(private readonly trapsService: TrapsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Daftar trap + event terkini', description: 'Untuk dashboard hama. Tiap trap beserta event terbarunya.' })
  list() {
    return this.trapsService.listWithLatest();
  }

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Ringkasan deteksi hama', description: 'Total event per jenis, deteksi hama hari ini, jumlah trap. Bisa filter ?deviceId=' })
  summary(@Query('deviceId') deviceId?: string) {
    return this.trapsService.summary(deviceId);
  }

  @Public()
  @Get(':deviceId/latest')
  @ApiOperation({ summary: 'Event terkini satu trap' })
  latestOne(@Param('deviceId') deviceId: string) {
    return this.trapsService.latestOne(deviceId);
  }

  @Public()
  @Get(':deviceId/history')
  @ApiOperation({ summary: 'Riwayat event trap', description: 'Untuk grafik tren. Filter ?eventType=pest_detected dan ?limit=' })
  history(
    @Param('deviceId') deviceId: string,
    @Query('limit') limit?: string,
    @Query('eventType') eventType?: string,
  ) {
    return this.trapsService.history(deviceId, limit ? +limit : 50, eventType);
  }
}
