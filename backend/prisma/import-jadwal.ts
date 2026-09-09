/**
 * Impor pendaftaran tanam serentak ke tabel field_schedules.
 *
 * Jalankan dari folder backend:
 *   npx tsx prisma/import-jadwal.ts prisma/komitmen-tanam-serentak.csv
 *   npx tsx prisma/import-jadwal.ts prisma/komitmen-tanam-serentak.csv --commit
 *
 * Tanpa --commit, skrip hanya menampilkan pratinjau tanpa menulis apa pun.
 *
 * PENTING: isi berkas CSV hanya dengan petani yang benar-benar sudah
 * menyatakan kesediaan mengikuti tanam serentak, sesuai surat pernyataan
 * kesepakatan bersama Kelompok Tani. Jangan menambahkan nama yang belum
 * memberikan persetujuan.
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

type Baris = {
  farmerName: string;
  fieldName?: string;
  padukuhan?: string;
  plantDate: Date;
  estimatedHarvest?: Date;
  status: string;
  notes?: string;
};

function baca(path: string): Baris[] {
  const isi = readFileSync(path, 'utf8').trim();
  const baris = isi.split(/\r?\n/);
  const kepala = baris[0].split(',').map((h) => h.trim());

  const wajib = ['farmerName', 'plantDate'];
  for (const w of wajib) {
    if (!kepala.includes(w)) throw new Error(`Kolom wajib "${w}" tidak ditemukan di CSV.`);
  }

  return baris.slice(1).filter((b) => b.trim()).map((b, i) => {
    const sel = b.split(',').map((s) => s.trim());
    const o: Record<string, string> = {};
    kepala.forEach((h, j) => (o[h] = sel[j] ?? ''));

    if (!o.farmerName) throw new Error(`Baris ${i + 2}: nama petani kosong.`);
    if (o.plantDate.includes('ISI-TANGGAL')) {
      throw new Error(`Baris ${i + 2}: kolom plantDate masih berisi ISI-TANGGAL. Ganti dengan tanggal tanam serentak yang sebenarnya, format YYYY-MM-DD.`);
    }
    const tanam = new Date(o.plantDate);
    if (Number.isNaN(tanam.getTime())) {
      throw new Error(`Baris ${i + 2}: tanggal tanam "${o.plantDate}" tidak valid (pakai YYYY-MM-DD).`);
    }
    const panen = o.estimatedHarvest ? new Date(o.estimatedHarvest) : undefined;

    return {
      farmerName: o.farmerName,
      fieldName: o.fieldName || undefined,
      padukuhan: o.padukuhan || undefined,
      plantDate: tanam,
      estimatedHarvest: panen && !Number.isNaN(panen.getTime()) ? panen : undefined,
      status: o.status || 'planned',
      notes: o.notes || undefined,
    };
  });
}

async function main() {
  const path = process.argv[2];
  const commit = process.argv.includes('--commit');

  if (!path) {
    console.error('Sebutkan berkas CSV-nya. Contoh: npx tsx prisma/import-jadwal.ts prisma/komitmen-tanam-serentak.csv');
    process.exit(1);
  }

  const data = baca(path);

  // Cegah nama contoh ikut terimpor
  const contoh = data.filter((d) => /contoh/i.test(d.farmerName));
  if (contoh.length > 0) {
    console.error(`Masih ada ${contoh.length} baris berisi nama contoh. Hapus dulu sebelum mengimpor.`);
    process.exit(1);
  }

  const sudahAda = await prisma.fieldSchedule.findMany({ select: { farmerName: true, plantDate: true } });
  const kunci = new Set(sudahAda.map((s) => `${s.farmerName.toLowerCase()}|${s.plantDate.toISOString().slice(0, 10)}`));
  const baru = data.filter((d) => !kunci.has(`${d.farmerName.toLowerCase()}|${d.plantDate.toISOString().slice(0, 10)}`));

  console.log(`Terbaca ${data.length} baris. Sudah ada ${data.length - baru.length}. Akan ditambahkan ${baru.length}.\n`);
  baru.slice(0, 10).forEach((d) =>
    console.log(`  ${d.farmerName.padEnd(24)} ${d.plantDate.toISOString().slice(0, 10)}  ${d.fieldName ?? '-'}`),
  );
  if (baru.length > 10) console.log(`  ... dan ${baru.length - 10} baris lainnya`);

  if (!commit) {
    console.log('\nIni baru pratinjau. Tambahkan --commit untuk benar-benar menyimpan.');
    return;
  }

  if (baru.length === 0) {
    console.log('\nTidak ada baris baru untuk disimpan.');
    return;
  }

  await prisma.fieldSchedule.createMany({ data: baru });
  console.log(`\n${baru.length} pendaftaran tersimpan.`);

  const total = await prisma.fieldSchedule.count();
  const semua = await prisma.fieldSchedule.findMany({ select: { farmerName: true } });
  const unik = new Set(semua.map((s) => s.farmerName.trim().toLowerCase())).size;
  console.log(`Total jadwal di sistem: ${total} | petani unik: ${unik}`);
}

main()
  .catch((e) => {
    console.error('Gagal:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
