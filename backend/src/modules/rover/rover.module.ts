import { Module } from '@nestjs/common';
import { RoverService } from './rover.service';
import { RoverController } from './rover.controller';

@Module({
  controllers: [RoverController],
  providers: [RoverService],
})
export class RoverModule {}
