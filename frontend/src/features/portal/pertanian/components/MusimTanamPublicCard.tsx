import { useState } from 'react';
import type { MusimTanam } from '../types/plantingSchedule';
import { formatTanggalPendek, hitungProgressMusim } from '../utils/formatPlantingSchedule';
import { TimelineTahapan } from './TimelineTahapan';
import { IconCalendarEvent, IconChevronDown, IconLeaf, IconMapPin } from '@tabler/icons-react';

type Props = {
  musim: MusimTanam;
  defaultOpen?: boolean;
};

const statusConfig = {
  AKTIF: { label: 'Sedang Berlangsung', cls: 'bg-[#e8f5e0] text-[#2d6a1f] border-[#a8d48a]' },
  DRAFT: { label: 'Belum Dimulai', cls: 'bg-[#f5f5f5] text-[#6C757D] border-[#d9d9d9]' },
  SELESAI: { label: 'Selesai', cls: 'bg-[#e8f0fe] text-[#1a56a4] border-[#a8c4f5]' },
};

export const MusimTanamPublicCard = ({ musim, defaultOpen = false }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const progress = hitungProgressMusim(musim.tahapan, musim.tanggalMulai, musim.tanggalSelesai);
  const cfg = statusConfig[musim.status] ?? statusConfig.DRAFT;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e5ecdf] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header card */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Kiri: info utama */}
          <div className="flex gap-4">
            {/* Ikon komoditas */}
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#eef4e6] flex items-center justify-center">
              <IconLeaf size={24} className="text-[#4f842f]" />
            </div>

            <div>
              {/* Judul */}
              <h3 className="text-base font-bold text-[#1a2e12] leading-tight group-hover:text-[#4f842f]">
                {musim.judul}
              </h3>

              {/* Meta info */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6C757D]">
                <span className="flex items-center gap-1 font-semibold text-[#4f842f]">
                  <IconLeaf size={12} />
                  {musim.komoditas.nama}
                </span>
                {musim.lokasi && (
                  <span className="flex items-center gap-1">
                    <IconMapPin size={12} />
                    {musim.lokasi}
                  </span>
                )}
                {(musim.tanggalMulai || musim.tanggalSelesai) && (
                  <span className="flex items-center gap-1">
                    <IconCalendarEvent size={12} />
                    {formatTanggalPendek(musim.tanggalMulai)}
                    {musim.tanggalSelesai && ` — ${formatTanggalPendek(musim.tanggalSelesai)}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Kanan: status + chevron */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${cfg.cls}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-[#6C757D]">
              {musim.tahapan.length} tahapan
            </span>
            <IconChevronDown
              size={18}
              className={`text-[#6C757D] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {/* Progress bar — hanya untuk status AKTIF */}
        {musim.status === 'AKTIF' && (
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between text-[10px] text-[#6C757D] mb-1.5">
              <span>Progress musim tanam</span>
              <span className="font-bold text-[#4f842f]">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#e5ecdf]">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-[#4f842f] to-[#72b841] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </button>

      {/* Expandable: daftar tahapan */}
      {isOpen && (
        <div className="border-t border-[#e5ecdf] bg-[#fbfdf8] px-6 py-5">
          <div className="mb-4 flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#4f842f]">
              Tahapan Kegiatan
            </p>
            <div className="flex-1 h-px bg-[#e5ecdf]" />
          </div>
          <TimelineTahapan tahapan={musim.tahapan} />
        </div>
      )}
    </article>
  );
};
