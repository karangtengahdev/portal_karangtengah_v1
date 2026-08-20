// Kontrak storage. Modul lain HANYA kenal interface ini,
// tidak tahu di belakangnya Supabase / S3 / lokal.
export interface UploadResult {
  url: string;
  path: string;
}

export interface StorageProvider {
  upload(
    buffer: Buffer,
    destPath: string,
    contentType: string,
  ): Promise<UploadResult>;
  delete(path: string): Promise<void>;
}

// token DI untuk inject provider
export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';
