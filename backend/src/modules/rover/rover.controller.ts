import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RoverService } from './rover.service';

// Monitoring rover - PUBLIK read-only (polling dari web/Flutter).
// Kontrol perangkat ada di SENAGARDA App terpisah, BUKAN di sini.
@ApiTags('public/rover')
@Controller('public/rover')
export class RoverController {
  constructor(private readonly roverService: RoverService) {}

  @Public()
  @Get('latest')
  @ApiOperation({ summary: 'Posisi terkini semua rover', description: 'Untuk tampil marker di maps. Polling tiap 3-5 detik.' })
  latestAll() {
    return this.roverService.latestAll();
  }

  @Public()
  @Get(':deviceId/latest')
  @ApiOperation({ summary: 'Posisi terkini satu rover' })
  latestOne(@Param('deviceId') deviceId: string) {
    return this.roverService.latestOne(deviceId);
  }

  @Public()
  @Get(':deviceId/track')
  @ApiOperation({ summary: 'Jejak posisi rover', description: 'Riwayat posisi untuk gambar rute (polyline) di maps.' })
  track(@Param('deviceId') deviceId: string, @Query('limit') limit?: string) {
    return this.roverService.track(deviceId, limit ? +limit : 50);
  }
}
