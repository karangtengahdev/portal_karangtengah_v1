import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// PENTING: PrismaClient dibuat DULUAN -- ini yang men-trigger Prisma
// otomatis load file .env (perilaku bawaan generated client Prisma).
// Setelah baris ini jalan, process.env.SUPABASE_URL dkk sudah terisi,
// makanya createClient() di bawah bisa langsung pakai process.env
// tanpa perlu import dotenv secara eksplisit (sama seperti seed.ts
// lain di project ini yang juga tidak import dotenv).
const prisma = new PrismaClient();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Kredensial ini SAMA PERSIS dengan default yang sudah diasumsikan di
// frontend (lihat useAuthForm.ts) dan contoh di openapi.json -- supaya
// begitu di-seed, login langsung bisa dicoba tanpa ubah kode apa pun.
const ADMIN_EMAIL = 'admin@nawasena.id';
const ADMIN_PASSWORD = 'admin1234';
const ADMIN_NAME = 'Admin NAWASENA';

async function main() {
  console.log('Seeding user admin...');

  // 1. Cek dulu apakah user ini sudah ada di Supabase Auth (supaya
  //    script ini aman dijalankan berkali-kali, tidak duplikat/error).
  const { data: existingUsers, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw listError;

  let authUser = existingUsers.users.find((u) => u.email === ADMIN_EMAIL);

  if (!authUser) {
    // 2. Buat user BARU di Supabase Auth. PENTING: role disimpan di
    //    app_metadata (BUKAN user_metadata) -- jwt.strategy.ts baca
    //    role admin/operator spesifik dari app_metadata.role.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // langsung terverifikasi, tidak perlu klik link email
      app_metadata: { role: 'admin' },
      user_metadata: { full_name: ADMIN_NAME },
    });
    if (error) throw error;
    authUser = data.user;
    console.log(`  + Auth user dibuat: ${ADMIN_EMAIL}`);
  } else {
    console.log(`  = Auth user sudah ada: ${ADMIN_EMAIL}`);
    // Pastikan tetap role admin walau usernya sudah ada dari sebelumnya
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      app_metadata: { role: 'admin' },
    });
  }

  // 3. Sinkronkan/upsert ke tabel profiles (Prisma) -- ini yang
  //    dibaca aplikasi untuk data non-auth (fullName, dll).
  await prisma.profile.upsert({
    where: { id: authUser.id },
    update: { email: ADMIN_EMAIL, fullName: ADMIN_NAME, role: 'admin' },
    create: {
      id: authUser.id,
      email: ADMIN_EMAIL,
      fullName: ADMIN_NAME,
      role: 'admin',
    },
  });
  console.log('  + Profile tersinkron di database.');

  console.log('\nSeed user admin selesai. Kredensial login:');
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Password : ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
