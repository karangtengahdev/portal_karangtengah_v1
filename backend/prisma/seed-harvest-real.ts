import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// KONVERSI: data lapangan Anda = TOTAL panen per lahan (karung),
// BUKAN sampel ubinan 2,5x2,5m yang dipakai rumus sistem (x1.6 BPS).
// Kalau angka karung langsung dimasukkan ke kolom ubinanKg, hasilnya
// akan salah (sistem akan kalikan seolah itu sampel kecil).
//
// Solusi: hitung MUNDUR dari data total Anda ke angka "setara ubinan"
// yang kalau dijalankan lewat rumus sistem, hasil akhirnya balik lagi
// jadi PERSIS total kg asli Anda. Caranya:
//   total_kg   = karung x KG_PER_KARUNG
//   kg_per_m2  = total_kg / luas_m2
//   ubinanKg   = kg_per_m2 x 6.25   (6.25 m2 = luas petak ubinan standar)
// Terbukti secara matematis: kalau ubinanKg ini nanti dikali 1.6 (rumus
// sistem) lalu dikali areaHa, hasilnya balik jadi total_kg yang sama.
const KG_PER_KARUNG = 35;

type RawEntry = {
  farmerName: string;
  areaM2: number;
  karung: number;
  note?: string;
};

// Sumber: DATA_PANEN_PETANI_KARANGTENGAH.pdf (tabel dengan Biaya Produksi).
// Yusuf Ali dikonfirmasi TETAP 160 karung (bukan salah ketik) -- lahan
// 10.000 m2 (1 ha), laju hasil 16 karung/1000 m2 x 10 = 160 karung.
const RAW_DATA: RawEntry[] = [
  { farmerName: 'Paiyo', areaM2: 700, karung: 3 },
  { farmerName: 'Parjiman', areaM2: 400, karung: 8 },
  { farmerName: 'Yusuf Ali', areaM2: 10000, karung: 160 },
  { farmerName: 'Sakinem', areaM2: 1500, karung: 7 },
  { farmerName: 'Muryono', areaM2: 600, karung: 10 },
  { farmerName: 'Sujio', areaM2: 3000, karung: 30 },
  { farmerName: 'Sumpono', areaM2: 500, karung: 12 },
  { farmerName: 'Mariyah', areaM2: 500, karung: 10 },
  { farmerName: 'Gantoro', areaM2: 900, karung: 15 },
  { farmerName: 'Waldi', areaM2: 900, karung: 15 },
  { farmerName: 'Waigimi', areaM2: 900, karung: 15 },
  { farmerName: 'Gojek', areaM2: 1000, karung: 18 },
  { farmerName: 'Tomo', areaM2: 2000, karung: 22 },
  { farmerName: 'Mujitomo', areaM2: 5000, karung: 55 },
  { farmerName: 'Budi', areaM2: 5000, karung: 60 },
  { farmerName: 'Adi Winarto', areaM2: 1500, karung: 16 },
  {
    // CATATAN: "Sudi Mulyo" di tabel terketik ini kemungkinan nama
    // KELOMPOK TANI, bukan nama petani -- di form tulisan tangan
    // (nomor responden 08), nama petaninya tertulis "Jauzale"/mirip
    // itu, dengan "Sudi Mulyo" sbg nama poktan-nya. Saya pakai apa
    // adanya dari tabel terketik Anda, tapi cek lagi form aslinya
    // kalau perlu dikoreksi.
    farmerName: 'Sudi Mulyo',
    areaM2: 1150,
    karung: 20,
    note: 'Kemungkinan ini nama kelompok tani, bukan nama petani -- cek form asli (No. Responden 08)',
  },
  { farmerName: 'Udin', areaM2: 300, karung: 8 },
  { farmerName: 'Subadi', areaM2: 3000, karung: 30 },
  { farmerName: 'Mijo', areaM2: 1000, karung: 12 },
  { farmerName: 'Gianto', areaM2: 1000, karung: 17 },
  { farmerName: 'Sarjio', areaM2: 20000, karung: 25 },
  { farmerName: 'Parjimun', areaM2: 800, karung: 9 },
  { farmerName: 'Jiono', areaM2: 2000, karung: 25 },
  { farmerName: 'Suwanti', areaM2: 2500, karung: 20 },
  { farmerName: 'Sarijo', areaM2: 1000, karung: 12 },
  { farmerName: 'Slamet', areaM2: 1000, karung: 10 },
  { farmerName: 'Khoiri', areaM2: 1000, karung: 12 },
  { farmerName: 'Semi', areaM2: 1000, karung: 11 },
  { farmerName: 'Sarimi', areaM2: 500, karung: 10 },
  { farmerName: 'Sagimin', areaM2: 2000, karung: 18 },
  { farmerName: 'Wali Mulyo', areaM2: 2000, karung: 25 },
  { farmerName: 'Engklek', areaM2: 3000, karung: 25 },
  { farmerName: 'Waliman', areaM2: 2000, karung: 25 },
  { farmerName: 'Nurhadi', areaM2: 1500, karung: 9 },
  { farmerName: 'Asyar', areaM2: 3000, karung: 42 },
  { farmerName: 'Sujilan', areaM2: 800, karung: 8 },
  { farmerName: 'Wujiono', areaM2: 600, karung: 8 },
  { farmerName: 'Mujiyem', areaM2: 200, karung: 4 },
  { farmerName: 'Sudarno', areaM2: 1500, karung: 15 },
  { farmerName: 'Sariman', areaM2: 400, karung: 7 },
];

// Tanggal panen: SEBAGIAN BESAR form tidak mencantumkan tanggal panen
// spesifik per petani (hanya beberapa form ada "Tanggal Pengambilan
// Data" sekitar 12-15 Agustus 2026). Karena tidak ada tanggal per-orang
// yang lengkap, saya pakai SATU tanggal representatif utk semua --
// BUKAN tanggal panen sesungguhnya per petani. Edit manual nanti kalau
// ada tanggal yang lebih akurat per petani.
const HARVEST_DATE = new Date('2026-08-13');
const PADUKUHAN = 'Karangtengah';

function hitungUbinanKg(areaM2: number, karung: number): number {
  const totalKg = karung * KG_PER_KARUNG;
  const kgPerM2 = totalKg / areaM2;
  return +(kgPerM2 * 6.25).toFixed(4);
}

// Replikasi PERSIS rumus di harvest.service.ts supaya angka yang
// tersimpan konsisten dgn yang akan dihitung sistem kalau data ini
// dimasukkan lewat form UI biasa.
function hitungYieldEstimasi(ubinanKg: number, areaHa: number) {
  const yieldTonHa = +(ubinanKg * 1.6).toFixed(3);
  const estimatedKg = +(yieldTonHa * 1000 * areaHa).toFixed(2);
  return { yieldTonHa, estimatedKg };
}

async function main() {
  console.log('Menghapus semua data panen lama...');
  const deleted = await prisma.harvestRecord.deleteMany({});
  console.log(`  - ${deleted.count} data lama dihapus.\n`);

  console.log(`Memasukkan ${RAW_DATA.length} data panen baru (konversi ${KG_PER_KARUNG} kg/karung)...\n`);

  for (const entry of RAW_DATA) {
    const areaHa = entry.areaM2 / 10000;
    const ubinanKg = hitungUbinanKg(entry.areaM2, entry.karung);
    const { yieldTonHa, estimatedKg } = hitungYieldEstimasi(ubinanKg, areaHa);

    await prisma.harvestRecord.create({
      data: {
        farmerName: entry.farmerName,
        padukuhan: PADUKUHAN,
        ubinanKg,
        areaHa,
        yieldTonHa,
        estimatedKg,
        harvestDate: HARVEST_DATE,
      },
    });

    const flag = entry.note ? '  [CEK]' : '';
    console.log(
      `  + ${entry.farmerName.padEnd(14)} ${entry.areaM2}m² / ${entry.karung} karung -> estimasi ${estimatedKg} kg${flag}`,
    );
    if (entry.note) console.log(`      ${entry.note}`);
  }

  console.log('\nSelesai. Total kg yang tersimpan seharusnya sama persis dengan (karung x 35) di data asli Anda.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
