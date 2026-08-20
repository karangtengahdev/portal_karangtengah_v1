# Deploy NAWASENA API ke Render

## 1. Push ke GitHub (lihat langkah di chat)

## 2. Render
1. render.com > New > Blueprint > connect repo nawasena-api
2. Render baca render.yaml otomatis
3. Isi Environment Variables (yang sync:false) dari .env LOKAL:
   - DATABASE_URL, DIRECT_URL
   - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY
   - BRIDGE_API_KEY
4. Deploy. Migrate jalan otomatis saat start (prisma migrate deploy).

## Catatan
- Free plan Render sleep setelah idle 15 menit (cold start ~30dtk). Wajar untuk demo.
- Health check: /v1/public/news
- CORS sudah enable (app.enableCors()). Batasi origin saat production nanti.
