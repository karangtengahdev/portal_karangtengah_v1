import { Module } from '@nestjs/common';
import { PadukuhanService } from './padukuhan.service';
import { PadukuhanController } from './padukuhan.controller';
import { PadukuhanCmsController } from './padukuhan-cms.controller';

@Module({
  controllers: [PadukuhanController, PadukuhanCmsController],
  providers: [PadukuhanService],
  exports: [PadukuhanService],
})
export class PadukuhanModule {}
