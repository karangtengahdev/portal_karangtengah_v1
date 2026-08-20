import { Inject, Injectable } from '@nestjs/common';
import {
  STORAGE_PROVIDER,
  StorageProvider,
  UploadResult,
} from './storage.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_PROVIDER) private provider: StorageProvider,
  ) {}

  upload(buffer: Buffer, destPath: string, contentType: string): Promise<UploadResult> {
    return this.provider.upload(buffer, destPath, contentType);
  }

  delete(path: string): Promise<void> {
    return this.provider.delete(path);
  }
}
