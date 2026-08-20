import { useState } from 'react';
import { IconCalendarStats, IconFilter, IconLeaf, IconSeeding, IconX } from '@tabler/icons-react';
import { usePublicJadwalTanam } from '../hooks/usePlantingSchedule';
import { MusimTanamPublicCard } from '../components/MusimTanamPublicCard';
import sawahBanner from '../../../../assets/karangtengah-sawah.jpg';

// ── Skeleton loader ──────────────────────────────────────────
const SkeletonCard = () => (
  <div className="h-36 animate-pulse rounded-2xl bg-[#eef3e8]" />
);

export const JadwalTanamPage = () => {
  const [filterKomoditasId, setFilterKomoditasId] = useState<string | undefined>(undefined);
  const { data: musimList, komoditasList, isLoading, error } = usePublicJadwalTanam(filterKomoditasId);

  const aktifCount = musimList.length;

  return (
    <div className="bg-[#fbfcf8] text-[#212529]">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative -mt-24 min-h-[480px] overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:min-h-[540px] lg:px-8 lg:pt-40">
        <img
          alt="Sawah pertanian Desa Karangtengah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={sawahBanner}
        />
        <div className="absolute inset-0 bg-[#0a1a06]/80" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fbfcf8] to-transparent" />

        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b8ee70] backdrop-blur-md">
            <IconSeeding size={15} stroke={1.8} />
            Pertanian Digital Desa
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[60px] lg:leading-[1.1]">
            Jadwal Tanam&nbsp;
            <span className="text-[#b8ee70]">Musim 2026</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d4dec8] sm:text-base">
            Pantau tahapan kegiatan pertanian desa mulai dari penyemaian benih hingga panen raya.
            Informasi real-time untuk seluruh warga Karangtengah.
          </p>

          {/* Quick stat */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <IconCalendarStats size={16} className="text-[#b8ee70]" />
              {aktifCount} Musim Tanam Aktif
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <IconLeaf size={16} className="text-[#b8ee70]" />
              {komoditasList.length} Komoditas
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────── */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">

          {/* Filter komoditas */}
          {komoditasList.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#6C757D]">
                <IconFilter size={13} />
                Filter
              </span>
              <button
                onClick={() => setFilterKomoditasId(undefined)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  !filterKomoditasId
                    ? 'border-[#4f842f] bg-[#4f842f] text-white shadow-sm'
                    : 'border-[#d1e9bb] bg-white text-[#4f842f] hover:border-[#4f842f]'
                }`}
              >
                Semua
              </button>
              {komoditasList.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setFilterKomoditasId(filterKomoditasId === k.id ? undefined : k.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    filterKomoditasId === k.id
                      ? 'border-[#4f842f] bg-[#4f842f] text-white shadow-sm'
                      : 'border-[#d1e9bb] bg-white text-[#4f842f] hover:border-[#4f842f]'
                  }`}
                >
                  <IconLeaf size={12} />
                  {k.nama}
                  {filterKomoditasId === k.id && <IconX size={11} />}
                </button>
              ))}
            </div>
          )}

          {/* Section heading */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#72b841]">
              Jadwal Aktif
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Musim Tanam yang Sedang Berjalan
            </h2>
            <p className="mt-2 text-sm text-[#6C757D]">
              Klik setiap kartu untuk melihat detail tahapan kegiatan per musim tanam.
            </p>
          </div>

          {/* States */}
          {error ? (
            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-10 text-center">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : musimList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#bdd9a8] bg-[#f7fbf3] px-6 py-16 text-center">
              <IconSeeding size={40} className="mx-auto text-[#bdd9a8] mb-3" />
              <p className="font-semibold text-[#4f842f]">
                {filterKomoditasId
                  ? 'Tidak ada musim tanam aktif untuk komoditas ini.'
                  : 'Belum ada jadwal musim tanam aktif yang tercatat.'}
              </p>
              {filterKomoditasId && (
                <button
                  onClick={() => setFilterKomoditasId(undefined)}
                  className="mt-3 text-sm text-[#4f842f] underline underline-offset-2"
                >
                  Tampilkan semua komoditas
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {musimList.map((musim, idx) => (
                <MusimTanamPublicCard
                  key={musim.id}
                  musim={musim}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          )}

          {/* Info bottom */}
          {!isLoading && !error && musimList.length > 0 && (
            <p className="mt-10 text-center text-xs text-[#6C757D]">
              Data jadwal tanam diperbarui secara berkala oleh tim pertanian desa.
              Hubungi kantor desa untuk informasi lebih lanjut.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
