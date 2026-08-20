import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  StorageProvider,
  UploadResult,
} from './storage.interface';

// Implementasi storage pakai Supabase Storage.
// Kalau nanti pindah ke S3, cukup buat file S3StorageProvider yang
// implements StorageProvider, lalu ganti di storage.module.ts.
@Injectable()
export class SupabaseStorageProvider implements StorageProvider {
  private readonly logger = new Logger(SupabaseStorageProvider.name);
  private client: SupabaseClient;
  private bucket: string;

  constructor(config: ConfigService) {
    this.client = createClient(
      config.get<string>('supabase.url')!,
      config.get<string>('supabase.serviceRoleKey')!,
    );
    this.bucket = config.get<string>('storage.bucket') ?? 'public-content';
  }

  async upload(
    buffer: Buffer,
    destPath: string,
    contentType: string,
  ): Promise<UploadResult> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(destPath, buffer, { contentType, upsert: true });
    if (error) {
      this.logger.error(`Upload gagal: ${error.message}`);
      throw new Error(`Upload gagal: ${error.message}`);
    }
    const { data } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(destPath);
    return { url: data.publicUrl, path: destPath };
  }

  async delete(path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([path]);
    if (error) {
      this.logger.error(`Delete gagal: ${error.message}`);
      throw new Error(`Delete gagal: ${error.message}`);
    }
  }
}
