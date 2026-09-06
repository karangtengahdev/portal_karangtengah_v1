/**
 * Mengisi satu baris asumsi perhitungan dampak ekonomi.
 * Jalankan dari folder backend:  npx tsx prisma/seed-asumsi.ts
 *
 * GANTI dua hal sebelum menjalankan:
 *   1. hargaGabahPerKg  — pakai harga yang benar-benar berlaku, lalu tulis sumbernya
 *   2. padukuhanPilot   — harus sama persis dengan isi kolom padukuhan di harvest_records
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cek dulu nilai padukuhan yang benar-benar ada di data
  const padukuhan = await prisma.harvestRecord.groupBy({
    by: ['padukuhan'],
    _count: { _all: true },
  });
  console.log('Padukuhan pada harvest_records:');
  padukuhan.forEach((p) => console.log(`  ${p.padukuhan ?? '(kosong)'} — ${p._count._all} catatan`));

  const asumsi = await prisma.asumsiEkonomi.create({
    data: {
      berlakuSejak: new Date('2026-09-01'),

      kerugianBaselineMin: 0.20,
      kerugianBaselineMaks: 0.30,
      kerugianTarget: 0.15,

      // ── GANTI: harga gabah kering panen yang berlaku ──
      hargaGabahPerKg: 6700,

      luasPilotHa: 2.5,
      luasTotalHa: 82.79,

      // ── GANTI: sesuaikan dengan salah satu nilai padukuhan di atas ──
      padukuhanPilot: 'Karangtengah',

      sumber: {
        kerugianBaseline:
          'Survei awal Tim PPK Ormawa RDC bersama Kelompok Tani Karangtengah, Juni 2026',
        kerugianTarget: 'Target Tujuan 1 subproposal PPK Ormawa 2026',
        hargaGabahPerKg:
          'GANTI: sebutkan sumbernya, mis. harga GKP tingkat petani Kab. Bantul menurut Dinas Pertanian dan Pangan, Agustus 2026',
        luasTotalHa: 'Data luas baku sawah Kalurahan Karangtengah',
        produktivitas: 'Metode ubinan 2,5 x 2,5 m, dihitung dari tabel harvest_records',
      },
      dicatatOleh: 'Rahadian Candra Vima Yoga',
    },
  });

  console.log('\nAsumsi tersimpan:', asumsi.id);
  console.log('Padukuhan pilot :', asumsi.padukuhanPilot);
  console.log('Harga gabah     : Rp', asumsi.hargaGabahPerKg, '/kg');
  console.log('\nPastikan sumber harga gabah sudah diisi sebelum dipakai sebagai bukti.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
