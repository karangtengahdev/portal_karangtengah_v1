import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding profil desa...');
  const existing = await prisma.villageProfile.findFirst();
  const data = {
    vision: 'Mewujudkan Kalurahan Karangtengah sebagai percontohan smart farming Kabupaten Bantul.',
    mission: 'Memberdayakan pemuda dan petani melalui teknologi pertanian berbasis IoT dan robotika.',
    description: 'Kalurahan Karangtengah, Imogiri, Bantul, DIY — desa pertanian dengan 1.709 keluarga petani yang bertransformasi menuju pertanian cerdas melalui program NAWASENA.',
    potency: [
      { title: 'Pertanian Padi', desc: 'Lahan sawah produktif dengan komoditas utama padi.' },
      { title: 'UMKM Lokal', desc: 'Beragam usaha olahan pangan dan kerajinan warga.' },
      { title: 'Pemuda Aktif', desc: 'Karang Taruna yang antusias mengadopsi teknologi.' },
    ],
    stats: { population: 6800, families: 1709, area_ha: 350, farmer_families: 1709 },
  };
  if (existing) {
    await prisma.villageProfile.update({ where: { id: existing.id }, data });
  } else {
    await prisma.villageProfile.create({ data });
  }
  console.log('Seed profil desa selesai.');
}
main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
