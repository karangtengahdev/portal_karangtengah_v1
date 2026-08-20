// ============================================================
// ENTRY POINT SERVERLESS UNTUK VERCEL
// ============================================================
// File ini HANYA dipakai Vercel (ditunjuk oleh vercel.json). Untuk
// development lokal, tetap pakai src/main.ts (npm run start:dev).
//
// Cara kerja: Vercel memanggil handler ini tiap request. Kita bootstrap
// aplikasi Nest SEKALI saja lalu simpan di variabel `cachedApp` (cache di
// memori function). Request berikutnya pakai instance yang sama -> tidak
// bikin koneksi database baru tiap request (penting untuk serverless).
//
// PENTING: TIDAK ada app.listen() di sini. Vercel yang mengurus HTTP server.
// TIDAK ada writeFileSync (filesystem Vercel read-only).

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { Express, Request, Response } from 'express';
import { AppModule } from './app.module';

// Instance Express + Nest yang di-cache antar invocation.
let cachedServer: Express | null = null;

async function bootstrapServer(): Promise<Express> {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  // --- Setup sama seperti main.ts, TANPA listen & writeFileSync ---
  app.setGlobalPrefix('v1');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger. Di serverless, docs di-serve dari memori (bukan file).
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NAWASENA Center API')
    .setDescription(
      [
        'Backend NAWASENA Center untuk PPK Ormawa RDC UAD.',
        '',
        '## Cara pakai',
        '- Endpoint **public/** bisa diakses tanpa login (untuk website publik).',
        '- Endpoint **cms/** butuh login admin. Klik **Authorize**, masukkan token.',
        '',
        '## Format response',
        'Semua response: `{ success: true, data: {...} }` atau `{ success: false, error: {...} }`.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Masukkan access_token dari Supabase Auth (tanpa kata Bearer)',
      },
      'access-token',
    )
    .addTag('public/news', 'Berita - akses publik (tanpa login)')
    .addTag('public/umkm', 'UMKM - akses publik (tanpa login)')
    .addTag('public/village', 'Profil desa - akses publik (tanpa login)')
    .addTag('cms/news', 'Berita - kelola (admin)')
    .addTag('cms/umkm', 'UMKM - kelola (admin)')
    .addTag('cms/village', 'Profil desa - kelola (admin)')
    .addTag('auth', 'Autentikasi')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    },
    customSiteTitle: 'NAWASENA API Docs',
  });

  await app.init(); // init SAJA, bukan listen
  return expressApp;
}

// Handler yang dipanggil Vercel tiap request.
export default async function handler(req: Request, res: Response) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  cachedServer(req, res);
}
