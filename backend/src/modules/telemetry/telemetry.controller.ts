import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BridgeKeyGuard } from '../../common/guards/bridge-key.guard';
import { Public } from '../../common/decorators/public.decorator';
import { TelemetryService } from './telemetry.service';
import { IngestDto } from './dto/ingest.dto';

// Ingest dari Bridge. @Public() bypass JWT, tapi dijaga BridgeKeyGuard (header x-bridge-key).
@ApiTags('ingest')
@Controller('ingest')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Public()
  @UseGuards(BridgeKeyGuard)
  @Post('telemetry')
  @ApiHeader({ name: 'x-bridge-key', description: 'Kunci rahasia Bridge', required: true })
  @ApiOperation({
    summary: 'Ingest data dari Bridge',
    description: 'Endpoint tunggal untuk semua data IoT. Bridge kirim {deviceId,type,data}. Backend simpan raw + routing ke rover_operations/trap_events. Butuh header x-bridge-key.',
  })
  ingest(@Body() dto: IngestDto) {
    return this.telemetryService.ingest(dto);
  }
}
