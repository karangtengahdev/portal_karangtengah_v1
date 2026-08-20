import { Module } from '@nestjs/common';
import { PlantingScheduleService } from './planting-schedule.service';
import { PlantingScheduleController } from './planting-schedule.controller';
import { PlantingScheduleCmsController } from './planting-schedule-cms.controller';

@Module({
  controllers: [PlantingScheduleController, PlantingScheduleCmsController],
  providers: [PlantingScheduleService],
  exports: [PlantingScheduleService],
})
export class PlantingScheduleModule {}
