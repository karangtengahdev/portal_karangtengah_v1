import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import configuration, {
  configValidationSchema,
} from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './modules/shared/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { RoverModule } from './modules/rover/rover.module';
import { TrapsModule } from './modules/traps/traps.module';
import { ScheduleModule as FarmScheduleModule } from './modules/schedule/schedule.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { NewsModule } from './modules/public-content/news/news.module';
import { UmkmModule } from './modules/public-content/umkm/umkm.module';
import { VillageModule } from './modules/public-content/village/village.module';
import { PlantingScheduleModule } from './modules/planting-schedule/planting-schedule.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    StorageModule,
    AuthModule,
    HealthModule,
    NewsModule,
    TelemetryModule,
    RoverModule,
    TrapsModule,
    FarmScheduleModule,
    HarvestModule,
    UmkmModule,
    VillageModule,
    PlantingScheduleModule,
    // TODO modul berikutnya: Umkm, Village, Telemetry, Realtime, Traps,
    //   Rover, Schedule, Notifications, Harvest, Reports
  ],
  providers: [
    // Guard global: semua endpoint butuh JWT kecuali @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Response shape {success, data}
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // Error shape {success, error}
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
