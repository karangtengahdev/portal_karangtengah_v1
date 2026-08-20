import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleCmsController } from './schedule-cms.controller';

@Module({
  controllers: [ScheduleController, ScheduleCmsController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
