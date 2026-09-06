import { Module } from '@nestjs/common';
import { EkonomiController } from './ekonomi.controller';
import { EkonomiService } from './ekonomi.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EkonomiController],
  providers: [EkonomiService],
  exports: [EkonomiService],
})
export class EkonomiModule {}
