import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TelemetryService } from './telemetry.service';

// Endpoint baca-saja utk verifikasi teknis: apakah data dari Bridge
// (Rover/Trap) sudah benar masuk ke database. SENGAJA @Public() --
// tidak butuh login, cukup tahu link-nya (halaman frontend-nya juga
// tersembunyi, tidak ada di navigasi manapun).
@ApiTags('public/telemetry')
@Controller('public/telemetry')
export class TelemetryPublicController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Public()
  @Get('recent')
  @ApiOperation({
    summary: 'Data telemetri mentah terbaru (debug)',
    description: 'Untuk verifikasi apakah data dari Bridge (Rover/Trap) sudah masuk. Filter opsional ?deviceId=&limit=',
  })
  listRecent(@Query('deviceId') deviceId?: string, @Query('limit') limit?: string) {
    return this.telemetryService.listRecent(limit ? +limit : 50, deviceId);
  }
}
