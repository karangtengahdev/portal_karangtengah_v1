import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding profil desa (level Kalurahan)...');

  // Data resmi dari PDF Profil Desa & Kelurahan (Prodeskel Kemendagri),
  // per Februari 2026 -- BUKAN perkiraan.
  const existing = await prisma.villageProfile.findFirst();
  const data = {
    lurahName: 'Haryanto',
    vision: 'Mewujudkan Kalurahan Karangtengah sebagai percontohan smart farming Kabupaten Bantul.',
    mission: 'Memberdayakan pemuda dan petani melalui teknologi pertanian berbasis IoT dan robotika.',
    description: 'Kalurahan Karangtengah, Kapanewon Imogiri, Kabupaten Bantul, DIY, terdiri atas 6 padukuhan dengan total penduduk 5.329 jiwa (1.857 KK). Sebagian besar warga bermata pencaharian di sektor pertanian, dengan luas sawah 82,79 Ha dari total wilayah 287,77 Ha.',
    potency: [
      { title: 'Pertanian Padi', desc: 'Sawah seluas 82,79 Ha dengan produksi 65,50 ton/ha per tahun.' },
      { title: 'UMKM Lokal', desc: 'Beragam usaha olahan pangan dan kerajinan warga di berbagai padukuhan.' },
      { title: 'Pemuda Aktif', desc: 'Karang Taruna di tiap padukuhan, salah satunya AMMI Karangtengah yang aktif dalam program smart farming.' },
    ],
    stats: {
      population: 5329,
      families: 1857,
      area_ha: 287.77,
      farmer_families: 1709,
    },
  };

  if (existing) {
    await prisma.villageProfile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.villageProfile.create({ data });
  }
  console.log('  + Profil Kalurahan tersimpan (Lurah: Haryanto).');
  console.log('Seed profil desa selesai.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
