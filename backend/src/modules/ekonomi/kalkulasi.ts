/**
 * Mesin perhitungan dampak ekonomi NAWASENA.
 *
 * Sengaja dibuat sebagai fungsi murni tanpa dependensi framework supaya bisa
 * diuji, diaudit, dan direproduksi ulang oleh siapa pun — termasuk reviewer.
 *
 * MODEL DASAR
 * -----------
 * Hasil panen yang tercatat dari petani (mis. 4,63 ton/ha) adalah hasil yang
 * SUDAH terkena kerugian hama. Jadi potensi hasil tanpa serangan hama adalah:
 *
 *     potensi = aktual / (1 - tingkatKerugian)
 *
 * Kerugian akibat hama, dalam satuan berat:
 *
 *     kerugian = potensi - aktual
 *
 * Bila intervensi menekan kerugian dari baseline ke target, hasil panen naik:
 *
 *     hasilSetelah  = potensi * (1 - targetKerugian)
 *     kenaikanHasil = hasilSetelah - aktual
 *     penghematan   = kenaikanHasil * hargaGabah
 *
 * Seluruh nilai uang dihitung dari berat gabah, bukan dari angka rupiah yang
 * ditetapkan lebih dulu. Dengan begitu setiap rupiah bisa ditelusuri kembali
 * ke kilogram, lalu ke laporan panen petani.
 */

export interface AsumsiPerhitungan {
  /** Rata-rata hasil panen tercatat (ton/ha). Dihitung dari laporan petani. */
  hasilAktualTonPerHa: number;
  /** Batas bawah tingkat kerugian hama sebelum program (fraksi, mis. 0.20). */
  kerugianBaselineMin: number;
  /** Batas atas tingkat kerugian hama sebelum program (fraksi, mis. 0.30). */
  kerugianBaselineMaks: number;
  /** Target tingkat kerugian setelah program (fraksi, mis. 0.15). */
  kerugianTarget: number;
  /** Harga gabah kering panen (Rp/kg). */
  hargaGabahPerKg: number;
  /** Luas lahan pilot (ha). */
  luasPilotHa: number;
  /** Luas total sawah kalurahan (ha). */
  luasTotalHa: number;
  /** Sumber tiap asumsi, ditampilkan apa adanya di layar. */
  sumber: Record<string, string>;
}

export interface SkenarioKerugian {
  tingkatKerugian: number;
  hasilPotensialTonPerHa: number;
  kerugianTonPerHa: number;
  kerugianKgPilot: number;
  kerugianRupiahPilot: number;
  kerugianRupiahTotal: number;
}

export interface HasilPerhitungan {
  asumsi: AsumsiPerhitungan;
  sebelum: {
    hasilTonPerHa: number;
    skenarioMin: SkenarioKerugian;
    skenarioMaks: SkenarioKerugian;
  };
  sesudah: {
    tingkatKerugian: number;
    /** Hasil panen setelah intervensi, dihitung dari tiap skenario baseline. */
    hasilTonPerHaMin: number;
    hasilTonPerHaMaks: number;
  };
  penghematan: {
    kenaikanTonPerHaMin: number;
    kenaikanTonPerHaMaks: number;
    rupiahPilotMin: number;
    rupiahPilotMaks: number;
  };
  proyeksiReplikasi: {
    luasHa: number;
    faktorPengali: number;
    rupiahMin: number;
    rupiahMaks: number;
  };
  /** Rantai perhitungan dalam bentuk teks, untuk ditampilkan di layar. */
  jejakPerhitungan: string[];
}

const bulat = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

function hitungSkenario(a: AsumsiPerhitungan, tingkatKerugian: number): SkenarioKerugian {
  if (tingkatKerugian <= 0 || tingkatKerugian >= 1) {
    throw new Error('Tingkat kerugian harus di antara 0 dan 1.');
  }
  const hasilPotensialTonPerHa = a.hasilAktualTonPerHa / (1 - tingkatKerugian);
  const kerugianTonPerHa = hasilPotensialTonPerHa - a.hasilAktualTonPerHa;
  const kerugianKgPilot = kerugianTonPerHa * 1000 * a.luasPilotHa;

  return {
    tingkatKerugian,
    hasilPotensialTonPerHa: bulat(hasilPotensialTonPerHa, 3),
    kerugianTonPerHa: bulat(kerugianTonPerHa, 3),
    kerugianKgPilot: Math.round(kerugianKgPilot),
    kerugianRupiahPilot: Math.round(kerugianKgPilot * a.hargaGabahPerKg),
    kerugianRupiahTotal: Math.round(
      kerugianTonPerHa * 1000 * a.luasTotalHa * a.hargaGabahPerKg,
    ),
  };
}

export function hitungDampakEkonomi(a: AsumsiPerhitungan): HasilPerhitungan {
  if (a.hasilAktualTonPerHa <= 0) {
    throw new Error('Belum ada data hasil panen. Perhitungan tidak dapat dijalankan.');
  }
  if (a.kerugianTarget >= a.kerugianBaselineMin) {
    throw new Error('Target kerugian harus lebih kecil dari baseline terendah.');
  }
  if (a.luasPilotHa <= 0 || a.luasTotalHa <= 0) {
    throw new Error('Luas lahan harus lebih besar dari nol.');
  }

  const skenarioMin = hitungSkenario(a, a.kerugianBaselineMin);
  const skenarioMaks = hitungSkenario(a, a.kerugianBaselineMaks);

  const hasilSesudahMin = skenarioMin.hasilPotensialTonPerHa * (1 - a.kerugianTarget);
  const hasilSesudahMaks = skenarioMaks.hasilPotensialTonPerHa * (1 - a.kerugianTarget);

  const kenaikanMin = hasilSesudahMin - a.hasilAktualTonPerHa;
  const kenaikanMaks = hasilSesudahMaks - a.hasilAktualTonPerHa;

  const rupiahPilotMin = kenaikanMin * 1000 * a.luasPilotHa * a.hargaGabahPerKg;
  const rupiahPilotMaks = kenaikanMaks * 1000 * a.luasPilotHa * a.hargaGabahPerKg;

  const faktorPengali = a.luasTotalHa / a.luasPilotHa;

  const rp = (n: number) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;

  return {
    asumsi: a,
    sebelum: {
      hasilTonPerHa: a.hasilAktualTonPerHa,
      skenarioMin,
      skenarioMaks,
    },
    sesudah: {
      tingkatKerugian: a.kerugianTarget,
      hasilTonPerHaMin: bulat(hasilSesudahMin, 3),
      hasilTonPerHaMaks: bulat(hasilSesudahMaks, 3),
    },
    penghematan: {
      kenaikanTonPerHaMin: bulat(kenaikanMin, 3),
      kenaikanTonPerHaMaks: bulat(kenaikanMaks, 3),
      rupiahPilotMin: Math.round(rupiahPilotMin),
      rupiahPilotMaks: Math.round(rupiahPilotMaks),
    },
    proyeksiReplikasi: {
      luasHa: a.luasTotalHa,
      faktorPengali: bulat(faktorPengali, 2),
      rupiahMin: Math.round(rupiahPilotMin * faktorPengali),
      rupiahMaks: Math.round(rupiahPilotMaks * faktorPengali),
    },
    jejakPerhitungan: [
      `Hasil panen tercatat: ${a.hasilAktualTonPerHa} ton/ha (rata-rata laporan petani).`,
      `Pada kerugian ${(a.kerugianBaselineMaks * 100).toFixed(0)}%, potensi hasil tanpa hama = ${a.hasilAktualTonPerHa} ÷ (1 − ${a.kerugianBaselineMaks}) = ${skenarioMaks.hasilPotensialTonPerHa} ton/ha.`,
      `Kehilangan akibat hama = ${skenarioMaks.hasilPotensialTonPerHa} − ${a.hasilAktualTonPerHa} = ${skenarioMaks.kerugianTonPerHa} ton/ha.`,
      `Di lahan pilot ${a.luasPilotHa} ha = ${skenarioMaks.kerugianKgPilot.toLocaleString('id-ID')} kg, senilai ${rp(skenarioMaks.kerugianRupiahPilot)} per musim.`,
      `Bila kerugian ditekan ke ${(a.kerugianTarget * 100).toFixed(0)}%, hasil panen menjadi ${bulat(hasilSesudahMaks, 3)} ton/ha.`,
      `Kenaikan hasil = ${bulat(kenaikanMaks, 3)} ton/ha, senilai ${rp(rupiahPilotMaks)} per musim di lahan pilot.`,
      `Bila diterapkan di seluruh ${a.luasTotalHa} ha (${bulat(faktorPengali, 2)}× luas pilot), nilainya menjadi ${rp(rupiahPilotMaks * faktorPengali)} per musim.`,
      `Harga gabah yang dipakai: ${rp(a.hargaGabahPerKg)}/kg — ${a.sumber.hargaGabahPerKg ?? 'sumber belum dicantumkan'}.`,
    ],
  };
}

/** Asumsi bawaan. Ganti nilainya lewat basis data, jangan diedit di sini. */
export const ASUMSI_BAWAAN: Omit<AsumsiPerhitungan, 'hasilAktualTonPerHa'> = {
  kerugianBaselineMin: 0.2,
  kerugianBaselineMaks: 0.3,
  kerugianTarget: 0.15,
  hargaGabahPerKg: 6700,
  luasPilotHa: 2.5,
  luasTotalHa: 82.79,
  sumber: {
    kerugianBaseline: 'Survei awal Tim PPK Ormawa RDC bersama Kelompok Tani, Juni 2026',
    kerugianTarget: 'Target Tujuan 1 subproposal PPK Ormawa 2026',
    hargaGabahPerKg: 'ISI SUMBER SEBENARNYA — mis. harga GKP tingkat petani, BPS/Dinas Pertanian Bantul',
    luasTotalHa: 'Data luas baku sawah Kalurahan Karangtengah',
  },
};
