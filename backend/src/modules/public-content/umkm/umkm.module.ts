import { Module } from '@nestjs/common';
import { UmkmService } from './umkm.service';
import { UmkmController } from './umkm.controller';
import { UmkmCmsController } from './umkm-cms.controller';

@Module({
  controllers: [UmkmController, UmkmCmsController],
  providers: [UmkmService],
  exports: [UmkmService],
})
export class UmkmModule {}
