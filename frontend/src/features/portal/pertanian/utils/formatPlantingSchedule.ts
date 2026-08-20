import type { TahapanJadwal } from '../types/plantingSchedule';

/** Format tanggal ISO ke format Indonesia, contoh: "2 September 2026" */
export const formatTanggalId = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

/** Format tanggal pendek, contoh: "2 Sep 2026" */
export const formatTanggalPendek = (iso: string | null | undefined): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso ?? '—';
  }
};

/** Hitung progress persen berdasarkan urutan tahapan terhadap tanggal hari ini */
export const hitungProgressMusim = (
  tahapan: TahapanJadwal[],
  tanggalMulai: string | null,
  tanggalSelesai: string | null,
): number => {
  if (!tanggalMulai || !tanggalSelesai || tahapan.length === 0) return 0;
  const now = Date.now();
  const mulai = new Date(tanggalMulai).getTime();
  const selesai = new Date(tanggalSelesai).getTime();
  if (now <= mulai) return 0;
  if (now >= selesai) return 100;
  const total = selesai - mulai;
  const elapsed = now - mulai;
  return Math.min(100, Math.round((elapsed / total) * 100));
};
