import { Module } from '@nestjs/common';
import { TrapsService } from './traps.service';
import { TrapsController } from './traps.controller';

@Module({
  controllers: [TrapsController],
  providers: [TrapsService],
})
export class TrapsModule {}
