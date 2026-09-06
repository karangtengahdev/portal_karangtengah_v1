import api from '../../../../api/axios';

export type PetakTerdokumentasi = {
  kodePetak: string;
  padukuhan: string;
  namaPetani: string;
  luasHa: number;
  hasilKg: number;
  produktivitasTonPerHa: number;
  tanggalPanen: string;
  bagianPilot: boolean;
};

export type RingkasanData = {
  periode: { dari: string; sampai: string };
  jumlahPetani: number;
  jumlahPetak: number;
  jumlahLaporan: number;
  totalLuasTerdataHa: number;
  totalHasilKg: number;
  rataProduktivitasTonPerHa: number;
  kerugianHamaTercatat: {
    tersedia: boolean;
    jumlahLaporan: number;
    rataFraksi: number | null;
  };
  petakTerdokumentasi: PetakTerdokumentasi[];
};

export type SkenarioKerugian = {
  tingkatKerugian: number;
  hasilPotensialTonPerHa: number;
  kerugianTonPerHa: number;
  kerugianKgPilot: number;
  kerugianRupiahPilot: number;
  kerugianRupiahTotal: number;
};

export type HasilPerhitungan = {
  asumsi: {
    hasilAktualTonPerHa: number;
    kerugianBaselineMin: number;
    kerugianBaselineMaks: number;
    kerugianTarget: number;
    hargaGabahPerKg: number;
    luasPilotHa: number;
    luasTotalHa: number;
    sumber: Record<string, string>;
  };
  sebelum: {
    hasilTonPerHa: number;
    skenarioMin: SkenarioKerugian;
    skenarioMaks: SkenarioKerugian;
  };
  sesudah: {
    tingkatKerugian: number;
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
  jejakPerhitungan: string[];
};

export type DampakEkonomi = {
  data: RingkasanData;
  perhitungan: HasilPerhitungan;
};

/**
 * Backend membungkus respons dalam { success, data }. Beberapa endpoint lama
 * mengembalikan objek polos, jadi keduanya ditangani di sini.
 */
function bukaBungkus<T>(muatan: unknown): T {
  if (muatan && typeof muatan === 'object' && 'data' in muatan && 'success' in muatan) {
    return (muatan as { data: T }).data;
  }
  return muatan as T;
}

export async function ambilDampakEkonomi(
  dari = '2026-01-01',
  sampai = '2026-12-31',
): Promise<DampakEkonomi> {
  const res = await api.get('/ekonomi/dampak', { params: { dari, sampai } });
  return bukaBungkus<DampakEkonomi>(res.data);
}
