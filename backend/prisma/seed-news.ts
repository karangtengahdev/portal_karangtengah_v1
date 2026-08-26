import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

function slugify(t: string) {
  return t
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

const newsSeed = [
  {
    title: 'Sosialisasi Akbar NAWASENA Resmi Digelar di Karangtengah',
    excerpt: 'Program PPK Ormawa RDC UAD memperkenalkan SENAGARDA dan NAWASENA Center kepada warga.',
    content: 'Tim PPK Ormawa RDC UAD menggelar sosialisasi akbar program NAWASENA di Kalurahan Karangtengah. Acara ini memperkenalkan robot SENAGARDA Rover, perangkap cerdas SENAGARDA Trap, serta platform digital NAWASENA Center kepada petani dan pemuda Karang Taruna. Antusiasme warga sangat tinggi dengan kehadiran lebih dari 50 peserta.',
  },
  {
    title: 'Penerjunan Resmi Tim Pelaksana ke Kalurahan Karangtengah',
    excerpt: 'Tim 15 mahasiswa resmi diterjunkan memulai program lima bulan.',
    content: 'Tim Pelaksana NAWASENA resmi diterjunkan ke Kalurahan Karangtengah, menandai dimulainya program smart farming selama lima bulan. Penerjunan ditandai penandatanganan kerja sama antara tim dan Pemerintah Kalurahan.',
  },
  {
    title: 'Pelatihan Pemuda Tahap Fundamental: Mengenal IoT dan Elektronika',
    excerpt: 'Pemuda Karang Taruna mengikuti pelatihan dasar IoT sebagai calon operator.',
    content: 'Rangkaian pelatihan pemuda dimulai dari tahap fundamental, memperkenalkan dasar IoT, komponen elektronika, dan teknik solder. Pelatihan ini menjadi fondasi bagi pemuda untuk menjadi operator teknologi pertanian desa.',
  },
  {
    title: 'Instalasi Perdana SENAGARDA di Lahan Pilot',
    excerpt: 'Sistem Rover, Trap, dan LoRa gateway terpasang di padukuhan pilot.',
    content: 'Instalasi perdana sistem SENAGARDA dilakukan di lahan pilot. Rover patroli, unit Trap, dan infrastruktur LoRa gateway berhasil terpasang dan terhubung ke NAWASENA Center, menampilkan data telemetri secara realtime.',
  },
  {
    title: 'NAWASENA Center: Satu Platform untuk Pertanian Karangtengah',
    excerpt: 'Platform digital mengintegrasikan jadwal tanam, pascapanen, dan monitoring.',
    content: 'NAWASENA Center hadir sebagai platform digital terpadu yang mengintegrasikan jadwal tanam serentak, dokumentasi pascapanen, monitoring Rover, dan etalase UMKM desa. Pemuda desa dilatih untuk mengelola platform ini secara mandiri.',
  },
];

async function main() {
  console.log('Seeding berita...');
  for (const n of newsSeed) {
    const slug = slugify(n.title);
    await prisma.news.upsert({
      where: { slug },
      update: {},
      create: { ...n, slug, status: 'published', publishedAt: new Date() },
    });
    console.log(`  + ${n.title}`);
  }
  console.log('Seed berita selesai.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
