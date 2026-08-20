import type { TahapanJadwal } from '../types/plantingSchedule';
import { formatTanggalPendek } from '../utils/formatPlantingSchedule';
import { IconCalendar, IconCheck } from '@tabler/icons-react';

type Props = {
  tahapan: TahapanJadwal[];
};

const isLewat = (tanggal: string | null) => {
  if (!tanggal) return false;
  return new Date(tanggal).getTime() < Date.now();
};

const isBerjalan = (mulai: string, selesai: string | null) => {
  const now = Date.now();
  const m = new Date(mulai).getTime();
  const s = selesai ? new Date(selesai).getTime() : Infinity;
  return now >= m && now <= s;
};

export const TimelineTahapan = ({ tahapan }: Props) => {
  if (tahapan.length === 0) {
    return (
      <p className="text-sm text-[#6C757D] italic text-center py-4">
        Belum ada tahapan yang ditambahkan.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Garis vertikal penghubung */}
      <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-[#4f842f]/60 via-[#b8ee70]/40 to-[#d1e9bb]/30" />

      <div className="space-y-0">
        {tahapan.map((t, idx) => {
          const lewat = isLewat(t.tanggalSelesai ?? t.tanggalMulai);
          const berjalan = isBerjalan(t.tanggalMulai, t.tanggalSelesai);
          const isLast = idx === tahapan.length - 1;

          return (
            <div key={t.id} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Dot / icon */}
              <div className="relative z-10 flex-shrink-0">
                {lewat ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f842f] shadow-md shadow-[#4f842f]/25">
                    <IconCheck size={18} className="text-white" />
                  </div>
                ) : berjalan ? (
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#D9A441] shadow-md shadow-[#D9A441]/30">
                    <span className="absolute inset-0 rounded-full bg-[#D9A441] animate-ping opacity-30" />
                    <span className="h-3 w-3 rounded-full bg-white" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d1e9bb] bg-white text-xs font-bold text-[#4f842f] shadow-sm">
                    {t.urutan}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 rounded-xl border p-4 transition-all duration-200 ${
                  berjalan
                    ? 'border-[#D9A441]/50 bg-[#FFFBF0] shadow-sm'
                    : lewat
                    ? 'border-[#e5ecdf] bg-[#f7fbf3]'
                    : 'border-[#e5ecdf] bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      berjalan ? 'text-[#D9A441]' : lewat ? 'text-[#4f842f]' : 'text-[#6C757D]'
                    }`}>
                      {berjalan ? '● Sedang Berjalan' : lewat ? '✓ Selesai' : `Tahap ${t.urutan}`}
                    </span>
                    <h4 className="mt-0.5 text-sm font-semibold text-[#1a2e12] leading-tight">
                      {t.namaTahapan}
                    </h4>
                    {t.deskripsi && (
                      <p className="mt-1.5 text-xs text-[#6C757D] leading-relaxed">
                        {t.deskripsi}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs text-[#6C757D] sm:text-right">
                    <IconCalendar size={12} />
                    <span>
                      {formatTanggalPendek(t.tanggalMulai)}
                      {t.tanggalSelesai && ` — ${formatTanggalPendek(t.tanggalSelesai)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
