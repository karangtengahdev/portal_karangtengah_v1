import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// PENTING: PrismaClient dibuat DULUAN -- ini yang men-trigger Prisma
// otomatis load file .env. Lihat catatan sama di versi sebelumnya file
// ini kenapa urutan ini penting.
const prisma = new PrismaClient();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Tiga akun terpisah sesuai pembagian area:
//  - admin     : superadmin cadangan, bisa akses SEMUA area (lihat
//                RolesGuard -- role 'admin' selalu lolos apa pun
//                requiredRoles-nya). Simpan baik-baik, jangan dibagi
//                ke tim biasa.
//  - portal    : untuk PEMUDA -- kelola Berita, UMKM, Profil Desa.
//  - nawasena  : untuk TIM TEKNOLOGI -- kelola Jadwal Tanam, Data
//                Panen, Jadwal.
const ACCOUNTS = [
  { email: 'admin@nawasena.id', password: 'admin1234', name: 'Superadmin', role: 'admin' },
  { email: 'portal@nawasena.id', password: 'portal1234', name: 'Admin Portal', role: 'portal' },
  { email: 'nawasena@nawasena.id', password: 'nawasena1234', name: 'Tim Teknologi', role: 'nawasena' },
];

async function seedOneAccount(acc: (typeof ACCOUNTS)[number]) {
  const { data: existingUsers, error: listError } =
    await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw listError;

  let authUser = existingUsers.users.find((u) => u.email === acc.email);

  if (!authUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      app_metadata: { role: acc.role },
      user_metadata: { full_name: acc.name },
    });
    if (error) throw error;
    authUser = data.user;
    console.log(`  + Auth user dibuat: ${acc.email} (role: ${acc.role})`);
  } else {
    console.log(`  = Auth user sudah ada: ${acc.email}`);
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      app_metadata: { role: acc.role },
    });
  }

  await prisma.profile.upsert({
    where: { id: authUser.id },
    update: { email: acc.email, fullName: acc.name, role: acc.role },
    create: {
      id: authUser.id,
      email: acc.email,
      fullName: acc.name,
      role: acc.role,
    },
  });
  console.log(`  + Profile tersinkron: ${acc.email}`);
}

async function main() {
  console.log('Seeding 3 akun (admin, portal, nawasena)...\n');

  for (const acc of ACCOUNTS) {
    await seedOneAccount(acc);
  }

  console.log('\nSeed selesai. Kredensial login:');
  for (const acc of ACCOUNTS) {
    console.log(`  [${acc.role.padEnd(8)}] ${acc.email} / ${acc.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
