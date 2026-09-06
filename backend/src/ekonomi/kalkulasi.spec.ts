import { hitungDampakEkonomi, ASUMSI_BAWAAN, AsumsiPerhitungan } from './kalkulasi';

const asumsi = (patch: Partial<AsumsiPerhitungan> = {}): AsumsiPerhitungan => ({
  ...ASUMSI_BAWAAN,
  hasilAktualTonPerHa: 4.63,
  ...patch,
});

describe('hitungDampakEkonomi', () => {
  it('menghasilkan kerugian baseline yang konsisten dengan subproposal', () => {
    const h = hitungDampakEkonomi(asumsi());
    // Subproposal: Rp 19,7 juta (kerugian 20%) — toleransi 5%
    expect(h.sebelum.skenarioMin.kerugianRupiahPilot).toBeGreaterThan(18_700_000);
    expect(h.sebelum.skenarioMin.kerugianRupiahPilot).toBeLessThan(20_700_000);
    // Subproposal: Rp 32,8 juta (kerugian 30%) — toleransi 5%
    expect(h.sebelum.skenarioMaks.kerugianRupiahPilot).toBeGreaterThan(31_100_000);
    expect(h.sebelum.skenarioMaks.kerugianRupiahPilot).toBeLessThan(34_500_000);
  });

  it('memenuhi target penghematan pada baseline kerugian tertinggi', () => {
    const h = hitungDampakEkonomi(asumsi());
    expect(h.penghematan.rupiahPilotMaks).toBeGreaterThan(15_000_000);
  });

  it('memenuhi target proyeksi replikasi bahkan pada skenario paling konservatif', () => {
    const h = hitungDampakEkonomi(asumsi());
    expect(h.proyeksiReplikasi.rupiahMin).toBeGreaterThan(150_000_000);
  });

  it('menjaga hubungan potensi, aktual, dan kerugian tetap benar', () => {
    const h = hitungDampakEkonomi(asumsi());
    const s = h.sebelum.skenarioMaks;
    expect(s.hasilPotensialTonPerHa - s.kerugianTonPerHa).toBeCloseTo(4.63, 2);
    expect(s.kerugianTonPerHa / s.hasilPotensialTonPerHa).toBeCloseTo(0.3, 3);
  });

  it('menskalakan proyeksi tepat sesuai rasio luas lahan', () => {
    const h = hitungDampakEkonomi(asumsi());
    expect(h.proyeksiReplikasi.faktorPengali).toBeCloseTo(82.79 / 2.5, 2);
    expect(h.proyeksiReplikasi.rupiahMaks / h.penghematan.rupiahPilotMaks).toBeCloseTo(
      82.79 / 2.5,
      1,
    );
  });

  it('menolak perhitungan bila belum ada data panen', () => {
    expect(() => hitungDampakEkonomi(asumsi({ hasilAktualTonPerHa: 0 }))).toThrow(
      /Belum ada data hasil panen/,
    );
  });

  it('menolak target yang tidak lebih baik dari baseline', () => {
    expect(() => hitungDampakEkonomi(asumsi({ kerugianTarget: 0.25 }))).toThrow(
      /lebih kecil dari baseline/,
    );
  });

  it('mengikuti perubahan harga gabah secara proporsional', () => {
    const murah = hitungDampakEkonomi(asumsi({ hargaGabahPerKg: 6000 }));
    const mahal = hitungDampakEkonomi(asumsi({ hargaGabahPerKg: 7000 }));
    expect(mahal.penghematan.rupiahPilotMaks / murah.penghematan.rupiahPilotMaks).toBeCloseTo(
      7000 / 6000,
      3,
    );
  });
});
