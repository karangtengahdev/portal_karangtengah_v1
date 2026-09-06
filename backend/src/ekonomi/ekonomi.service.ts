import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hitungDampakEkonomi, AsumsiPerhitungan, HasilPerhitungan } from './kalkulasi';

export interface RingkasanData {
  periode: { dari: string; sampai: string };
  jumlahPetani: number;
  jumlahPetak: number;
  jumlahLaporan: number;
  totalLuasTerdataHa: number;
  totalHasilKg: number;
  rataProduktivitasTonPerHa: number;
  /** Rata-rata kerugian hama yang benar-benar dilaporkan petani, bila ada. */
  kerugianHamaTercatat: {
    tersedia: boolean;
    jumlahLaporan: number;
    rataFraksi: number | null;
  };
  petakTerdokumentasi: Array<{
    kodePetak: string;
    padukuhan: string;
    namaPetani: string;
    luasHa: number;
    hasilKg: number;
    produktivitasTonPerHa: number;
    tanggalPanen: string;
    bagianPilot: boolean;
  }>;
}

@Injectable()
export class EkonomiService {
  constructor(private readonly prisma: PrismaService) {}

  /** Asumsi yang berlaku terbaru. */
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
   * Merangkum laporan panen pada rentang tanggal tertentu.
   *
   * Sumber datanya adalah tabel harvest_records yang sudah ada. Produktivitas
   * dihitung tertimbang luas lahan, bukan rata-rata sederhana, supaya petak
   * besar tidak berbobot sama dengan petak kecil.
   */
  async ringkasData(dari: Date, sampai: Date, padukuhanPilot: string): Promise<RingkasanData> {
    const catatan = await this.prisma.harvestRecord.findMany({
      where: { harvestDate: { gte: dari, lte: sampai } },
      orderBy: { harvestDate: 'asc' },
    });

    if (catatan.length === 0) {
      throw new NotFoundException(
        `Belum ada catatan panen antara ${dari.toISOString().slice(0, 10)} dan ${sampai
          .toISOString()
          .slice(0, 10)}. Perhitungan memerlukan minimal satu catatan.`,
      );
    }

    let totalLuas = 0;
    let totalHasil = 0;
    let jumlahKerugian = 0;
    let totalKerugian = 0;
    const petani = new Set<string>();
    const petak = new Set<string>();

    const petakTerdokumentasi = catatan.map((c) => {
      const luas = c.areaHa ?? 0;
      // estimatedKg dipakai bila ada; bila kosong, diturunkan dari hasil ubinan.
      const hasil = c.estimatedKg ?? (c.yieldTonHa ?? 0) * 1000 * luas;

      totalLuas += luas;
      totalHasil += hasil;
      petani.add(c.farmerName.trim().toLowerCase());
      petak.add(`${c.farmerName}::${c.fieldName ?? c.id}`);

      if (c.pestLossPct !== null && c.pestLossPct !== undefined) {
        jumlahKerugian += 1;
        // Menerima nilai sebagai persen (0–100) maupun fraksi (0–1).
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
        bagianPilot:
          (c.padukuhan ?? '').trim().toLowerCase() === padukuhanPilot.trim().toLowerCase(),
      };
    });

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
      rataProduktivitasTonPerHa:
        totalLuas > 0 ? Number((totalHasil / 1000 / totalLuas).toFixed(3)) : 0,
      kerugianHamaTercatat: {
        tersedia: jumlahKerugian > 0,
        jumlahLaporan: jumlahKerugian,
        rataFraksi: jumlahKerugian > 0 ? Number((totalKerugian / jumlahKerugian).toFixed(4)) : null,
      },
      petakTerdokumentasi,
    };
  }

  async dampakEkonomi(
    dari: Date,
    sampai: Date,
  ): Promise<{ data: RingkasanData; perhitungan: HasilPerhitungan }> {
    const a = await this.asumsiBerlaku();
    const data = await this.ringkasData(dari, sampai, a.padukuhanPilot);

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
