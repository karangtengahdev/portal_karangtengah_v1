import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('v1');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NAWASENA Center API')
    .setDescription(
      [
        'Backend NAWASENA Center untuk PPK Ormawa RDC UAD.',
        '',
        '## Cara pakai',
        '- Endpoint **public/** bisa diakses tanpa login (untuk website publik).',
        '- Endpoint **cms/** butuh login admin. Klik tombol **Authorize** di kanan atas, masukkan token (format: `Bearer <token>` tidak perlu, cukup token-nya).',
        '',
        '## Format response',
        'Semua response: `{ success: true, data: {...} }` atau `{ success: false, error: {...} }`.',
        '',
        '## Autentikasi',
        'Login via Supabase Auth untuk dapat access_token, lalu Authorize di sini.',
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

  // Simpan OpenAPI JSON ke file (untuk generate API client di frontend)
  if (config.get('nodeEnv') !== 'production') {
    writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    },
    customSiteTitle: 'NAWASENA API Docs',
  });

  const port = config.get<number>('port') ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`NAWASENA API jalan di http://localhost:${port}/v1`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
  console.log(`OpenAPI JSON: http://localhost:${port}/docs-json`);
}
bootstrap();
