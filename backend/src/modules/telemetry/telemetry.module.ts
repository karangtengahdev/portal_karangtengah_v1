import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';
import { TelemetryPublicController } from './telemetry-public.controller';

@Module({
  controllers: [TelemetryController, TelemetryPublicController],
  providers: [TelemetryService],
})
export class TelemetryModule {}
