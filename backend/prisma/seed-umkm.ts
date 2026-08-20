import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);
}

const umkmSeed = [
  {
    name: 'Keripik Tela Bu Sari',
    ownerName: 'Bu Sari',
    description: 'Keripik singkong renyah aneka rasa, produksi rumahan Karangtengah.',
    category: 'makanan',
    contactPhone: '081234567801',
    contactAddress: 'Padukuhan Karangtengah',
    products: [
      { name: 'Keripik Original', price: 12000, unit: 'bungkus', stock: 50, note: '200gr' },
      { name: 'Keripik Balado', price: 14000, unit: 'bungkus', stock: 40, note: '200gr' },
    ],
  },
  {
    name: 'Anyaman Bambu Pak Tomo',
    ownerName: 'Pak Tomo',
    description: 'Kerajinan anyaman bambu: besek, tampah, dan wadah serbaguna.',
    category: 'kerajinan',
    contactPhone: '081234567802',
    contactAddress: 'Padukuhan Karangtengah',
    products: [
      { name: 'Besek Bambu', price: 8000, unit: 'pcs', stock: 100 },
      { name: 'Tampah Sedang', price: 25000, unit: 'pcs', stock: 30 },
    ],
  },
  {
    name: 'Beras Organik Tani Makmur',
    ownerName: 'Kelompok Tani Makmur',
    description: 'Beras hasil panen lokal Karangtengah, kualitas premium.',
    category: 'tani',
    contactPhone: '081234567803',
    contactAddress: 'Karangtengah, Imogiri',
    products: [
      { name: 'Beras Putih', price: 13000, unit: 'kg', stock: 500 },
      { name: 'Beras Merah', price: 18000, unit: 'kg', stock: 200 },
    ],
  },
  {
    name: 'Gula Jawa Mbah Rejo',
    ownerName: 'Mbah Rejo',
    description: 'Gula kelapa asli tanpa campuran, dibuat tradisional.',
    category: 'makanan',
    contactPhone: '081234567804',
    contactAddress: 'Padukuhan Karangtengah',
    products: [
      { name: 'Gula Jawa Cetak', price: 16000, unit: 'kg', stock: 80 },
    ],
  },
  {
    name: 'Telur Ayam Kampung Berkah',
    ownerName: 'Pak Yanto',
    description: 'Telur ayam kampung segar dari peternakan warga.',
    category: 'tani',
    contactPhone: '081234567805',
    contactAddress: 'Karangtengah',
    products: [
      { name: 'Telur Ayam Kampung', price: 2500, unit: 'butir', stock: 300 },
    ],
  },
  {
    name: 'Batik Tulis Sekar Arum',
    ownerName: 'Ibu Arum',
    description: 'Batik tulis motif khas dengan pewarna alami.',
    category: 'kerajinan',
    contactPhone: '081234567806',
    contactAddress: 'Padukuhan Karangtengah',
    products: [
      { name: 'Kain Batik Tulis', price: 250000, unit: 'lembar', stock: 15, note: '2m, katun' },
    ],
  },
];

async function main() {
  console.log('Seeding UMKM...');
  for (const u of umkmSeed) {
    const slug = slugify(u.name);
    await prisma.umkm.upsert({
      where: { slug },
      update: {},
      create: { ...u, slug, status: 'published', products: u.products as any },
    });
    console.log(`  + ${u.name}`);
  }
  console.log('Seed UMKM selesai.');
}
main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
