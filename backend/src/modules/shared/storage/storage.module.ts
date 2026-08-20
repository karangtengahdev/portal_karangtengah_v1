import { Global, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SupabaseStorageProvider } from './supabase-storage.provider';
import { STORAGE_PROVIDER } from './storage.interface';

// GANTI PROVIDER DI SINI kalau pindah storage (S3/lokal):
// { provide: STORAGE_PROVIDER, useClass: S3StorageProvider }
@Global()
@Module({
  providers: [
    StorageService,
    { provide: STORAGE_PROVIDER, useClass: SupabaseStorageProvider },
  ],
  exports: [StorageService],
})
export class StorageModule {}
