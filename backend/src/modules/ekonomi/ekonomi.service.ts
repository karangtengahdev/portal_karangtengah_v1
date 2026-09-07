import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { hitungDampakEkonomi, AsumsiPerhitungan, HasilPerhitungan } from './kalkulasi';

export interface PetakTerdokumentasi {
  kodePetak: string;
  padukuhan: string;
  namaPetani: string;
  luasHa: number;
  hasilKg: number;
  produktivitasTonPerHa: number;
  tanggalPanen: string;
}

export interface RingkasanData {
  periode: { dari: string; sampai: string };
  jumlahPetani: number;
  jumlahPetak: number;
  jumlahLaporan: number;
  totalLuasTerdataHa: number;
  totalHasilKg: number;
  /** Total hasil dibagi total luas. Dipakai untuk seluruh perhitungan nilai. */
  rataProduktivitasTonPerHa: number;
  /** Rata-rata sederhana kolom ton/ha. Menjawab pertanyaan berbeda: hasil petak pada umumnya. */
  rataPerPetakTonPerHa: number;
  kerugianHamaTercatat: {
    tersedia: boolean;
    jumlahLaporan: number;
    rataFraksi: number | null;
  };
  /** Petak dengan produktivitas terendah — indikasi serangan hama terparah. */
  kasusTerparah: (PetakTerdokumentasi & { selisihDariRataPersen: number }) | null;
  petakTerdokumentasi: PetakTerdokumentasi[];
}

@Injectable()
export class EkonomiService {
  constructor(private readonly prisma: PrismaService) {}

  async asumsiBerlaku() {
    const a = await this.prisma.asumsiEkonomi.findFirst({
      orderBy: { berlakuSejak: 'desc' },
    });
    if (!a) {
      throw new NotFoundException(
        'Asumsi perhitungan belum diisi. Jalankan prisma/seed-asumsi.ts terlebih dahulu.',
      );
    }
    return a;
  }

  /**
   * Merangkum catatan panen pada rentang tanggal tertentu.
   *
   * Dua rata-rata dihitung karena keduanya menjawab pertanyaan berbeda:
   *  - tertimbang luas  : berapa hasil seluruh sawah terdata. Dipakai menghitung nilai rupiah.
   *  - rata-rata petak  : berapa hasil sebuah petak pada umumnya.
   * Selisih keduanya menunjukkan ketimpangan antarpetak, bukan kesalahan hitung.
   */
  async ringkasData(dari: Date, sampai: Date): Promise<RingkasanData> {
    const catatan = await this.prisma.harvestRecord.findMany({
      where: { harvestDate: { gte: dari, lte: sampai } },
      orderBy: { harvestDate: 'asc' },
    });

    if (catatan.length === 0) {
      throw new NotFoundException(
        `Belum ada catatan panen antara ${dari.toISOString().slice(0, 10)} dan ${sampai
          .toISOString()
          .slice(0, 10)}.`,
      );
    }

    let totalLuas = 0;
    let totalHasil = 0;
    let jumlahKerugian = 0;
    let totalKerugian = 0;
    const petani = new Set<string>();
    const petak = new Set<string>();

    const petakTerdokumentasi: PetakTerdokumentasi[] = catatan.map((c) => {
      const luas = c.areaHa ?? 0;
      const hasil = c.estimatedKg ?? (c.yieldTonHa ?? 0) * 1000 * luas;

      totalLuas += luas;
      totalHasil += hasil;
      petani.add(c.farmerName.trim().toLowerCase());
      petak.add(`${c.farmerName}::${c.fieldName ?? c.id}`);

      if (c.pestLossPct !== null && c.pestLossPct !== undefined) {
        jumlahKerugian += 1;
        totalKerugian += c.pestLossPct > 1 ? c.pestLossPct / 100 : c.pestLossPct;
      }

      return {
        kodePetak: c.fieldName ?? `Petak ${c.id.slice(0, 8)}`,
        padukuhan: c.padukuhan ?? '—',
        namaPetani: c.farmerName,
        luasHa: Number(luas.toFixed(4)),
        hasilKg: Number(hasil.toFixed(2)),
        produktivitasTonPerHa:
          c.yieldTonHa ?? (luas > 0 ? Number((hasil / 1000 / luas).toFixed(3)) : 0),
        tanggalPanen: c.harvestDate.toISOString().slice(0, 10),
      };
    });

    const rataTertimbang = totalLuas > 0 ? totalHasil / 1000 / totalLuas : 0;
    const rataPerPetak =
      petakTerdokumentasi.reduce((t, p) => t + p.produktivitasTonPerHa, 0) /
      petakTerdokumentasi.length;

    // Petak terparah: produktivitas terendah, dan luasnya cukup berarti (>= 0,1 ha)
    // supaya bukan sekadar petak mungil dengan pembulatan ekstrem.
    const kandidat = petakTerdokumentasi.filter((p) => p.luasHa >= 0.1);
    const terparah = (kandidat.length > 0 ? kandidat : petakTerdokumentasi).reduce((a, b) =>
      a.produktivitasTonPerHa <= b.produktivitasTonPerHa ? a : b,
    );

    return {
      periode: {
        dari: dari.toISOString().slice(0, 10),
        sampai: sampai.toISOString().slice(0, 10),
      },
      jumlahPetani: petani.size,
      jumlahPetak: petak.size,
      jumlahLaporan: catatan.length,
      totalLuasTerdataHa: Number(totalLuas.toFixed(4)),
      totalHasilKg: Number(totalHasil.toFixed(2)),
      rataProduktivitasTonPerHa: Number(rataTertimbang.toFixed(3)),
      rataPerPetakTonPerHa: Number(rataPerPetak.toFixed(3)),
      kerugianHamaTercatat: {
        tersedia: jumlahKerugian > 0,
        jumlahLaporan: jumlahKerugian,
        rataFraksi:
          jumlahKerugian > 0 ? Number((totalKerugian / jumlahKerugian).toFixed(4)) : null,
      },
      kasusTerparah:
        rataTertimbang > 0
          ? {
              ...terparah,
              selisihDariRataPersen: Number(
                ((1 - terparah.produktivitasTonPerHa / rataTertimbang) * 100).toFixed(1),
              ),
            }
          : null,
      petakTerdokumentasi,
    };
  }

  async dampakEkonomi(
    dari: Date,
    sampai: Date,
  ): Promise<{ data: RingkasanData; perhitungan: HasilPerhitungan }> {
    const a = await this.asumsiBerlaku();
    const data = await this.ringkasData(dari, sampai);

    const asumsi: AsumsiPerhitungan = {
      hasilAktualTonPerHa: data.rataProduktivitasTonPerHa,
      kerugianBaselineMin: a.kerugianBaselineMin,
      kerugianBaselineMaks: a.kerugianBaselineMaks,
      kerugianTarget: a.kerugianTarget,
      hargaGabahPerKg: a.hargaGabahPerKg,
      luasPilotHa: a.luasPilotHa,
      luasTotalHa: a.luasTotalHa,
      sumber: a.sumber as Record<string, string>,
    };

    return { data, perhitungan: hitungDampakEkonomi(asumsi) };
  }
}
