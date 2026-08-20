# NAWASENA Center API

Backend NAWASENA Center — NestJS + Prisma (PostgreSQL via Supabase).
Auth tetap Supabase Auth (JWT ES256 via JWKS). DB diakses lewat Prisma agar portabel.

## Arsitektur

- **Pola A**: NestJS sebagai gateway tunggal. Frontend hanya konsumsi API, tidak menyentuh DB langsung.
- **Prisma**: akses DB via connection string PostgreSQL standar → mudah migrasi keluar dari Supabase nanti (cukup ganti `DATABASE_URL`).
- **Pooling vs Direct**: `DATABASE_URL` (port 6543, pooler) untuk runtime; `DIRECT_URL` (port 5432) untuk migrate & seed.
- **Auth**: Supabase Auth, token diverifikasi via JWKS (ES256). Role dari `app_metadata.role`.
- **Response**: `{ success, data }` (sukses) / `{ success, error }` (error).
- **Endpoint publik** (`/v1/public/...`) bypass auth, hanya konten published.
- **Endpoint CMS** (`/v1/cms/...`) butuh role admin.

## Setup dari Nol

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```
Isi `.env` dari Supabase Dashboard → Settings:
- **Database** → Connection string → ambil URI untuk `DATABASE_URL` (Transaction/pooler 6543) dan `DIRECT_URL` (Session/direct 5432)
- **API** → `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`

### 3. Generate Prisma client + migrate
```bash
npm run prisma:generate
npm run prisma:migrate    # buat tabel di database
```

### 4. Seed data awal
```bash
npm run seed
```

### 5. Jalankan
```bash
npm run start:dev
```
- API: http://localhost:3000/v1
- Swagger: http://localhost:3000/docs

## Struktur Modul

```
src/
  config/              konfigurasi + validasi Joi
  prisma/              PrismaService (global)
  common/
    interceptors/      TransformInterceptor {success,data}
    filters/           AllExceptionsFilter {success,error}
    guards/            JwtAuthGuard, RolesGuard, BridgeKeyGuard
    decorators/        @Public(), @Roles()
  modules/
    auth/              JWT JWKS strategy + /auth/me
    public-content/
      news/            ← SUDAH JADI (template)
      umkm/            TODO (ikut pola news)
      village/         TODO
    telemetry/ realtime/ traps/ rover/        TODO (rebuild dari versi lama)
    schedule/ notifications/ harvest/ reports/ TODO
    shared/storage/    TODO (abstraksi Supabase Storage)
```

## Status Rebuild

**Sudah jadi:**
- Fondasi: config, Prisma schema (semua tabel), PrismaService
- Common: interceptor, filter, guards, decorators
- Auth: JWKS strategy + guard global
- Modul News (publik + CMS + seed) — jadi template modul lain

**Belum (urutan berikutnya):**
1. UMKM (ikut pola News)
2. Village Profile
3. Storage service (upload gambar)
4. Modul IoT: Telemetry, Realtime, Traps, Rover
5. Schedule, Notifications, Harvest+Calculating, Reports

## Endpoint News (contoh pola)

```
# Publik
GET  /v1/public/news?page=1&limit=10
GET  /v1/public/news/:slug

# CMS (Bearer token, role admin)
GET    /v1/cms/news
POST   /v1/cms/news
PUT    /v1/cms/news/:id
DELETE /v1/cms/news/:id
PATCH  /v1/cms/news/:id/publish   body: { "publish": true }
```

## Deploy (nanti)

Hosting sementara: Render. Set semua env var, pastikan `prisma migrate deploy` jalan saat build.
