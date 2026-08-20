import { Module } from '@nestjs/common';
import { VillageService } from './village.service';
import { VillageController } from './village.controller';
import { VillageCmsController } from './village-cms.controller';

@Module({
  controllers: [VillageController, VillageCmsController],
  providers: [VillageService],
  exports: [VillageService],
})
export class VillageModule {}
