import { Module } from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { HarvestController } from './harvest.controller';
import { HarvestCmsController } from './harvest-cms.controller';

@Module({
  controllers: [HarvestController, HarvestCmsController],
  providers: [HarvestService],
  exports: [HarvestService],
})
export class HarvestModule {}
