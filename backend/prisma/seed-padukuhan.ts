import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// HANYA Padukuhan Karangtengah yang diisi lengkap sekarang -- itu
// satu-satunya yang punya data nyata (Kepala Dukuh, kegiatan AMMI,
// program NAWASENA). 5 padukuhan lain SENGAJA TIDAK dibuat di sini --
// nama & Kepala Dukuh-nya belum saya punya datanya (PDF Profil Desa
// tidak mencantumkan nama 5 dukuh lain secara spesifik). Tambahkan
// manual lewat CMS begitu datanya didapat, bukan saya karang-karang.
async function main() {
  console.log('Seeding Padukuhan Karangtengah...');

  await prisma.padukuhan.upsert({
    where: { name: 'Karangtengah' },
    update: {
      kepalaDukuh: 'Sumardiyono',
      hasData: true,
    },
    create: {
      name: 'Karangtengah',
      kepalaDukuh: 'Sumardiyono',
      sambutan:
        'Selamat datang di halaman Padukuhan Karangtengah. Kami bangga menjadi lokasi program NAWASENA, sistem pertanian cerdas berbasis robotika dan IoT yang dikembangkan bersama Robotic Development Community (RDC) Universitas Ahmad Dahlan dan pemuda AMMI Karangtengah. Program ini diharapkan membantu warga mengatasi hama tikus dan meningkatkan produktivitas padi secara berkelanjutan.',
      description: 'Padukuhan Karangtengah adalah satu dari 6 padukuhan di Kalurahan Karangtengah, dan menjadi lokasi pilot program NAWASENA sejak Juni 2026.',
      hasData: true,
      orderIndex: 0,
    },
  });

  console.log('  + Padukuhan Karangtengah tersimpan.');
  console.log('Seed padukuhan selesai. Tambahkan 5 padukuhan lain manual via CMS begitu datanya tersedia.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
