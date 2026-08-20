import { IconBug, IconChartArrowsVertical, IconScale, IconSeeding, IconTractor } from '@tabler/icons-react';
import { usePublicPertanian } from '../hooks/usePertanian';
import { formatDecimal } from '../utils/formatPertanian';
import { PadukuhanStatCard } from '../components/PadukuhanStatCard';
import { HarvestTable } from '../components/HarvestTable';

import sawahBanner from '../../../../assets/karangtengah-sawah.jpg';

export const PertanianPage = () => {
  const { harvests, stats, isLoading, error } = usePublicPertanian();

  return (
    <div className="bg-[#fbfcf8] text-[#212529]">
      {/* Hero Section */}
      <section className="relative -mt-24 min-h-[480px] overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:min-h-[540px] lg:px-8 lg:pt-40">
        <img
          alt="Hamparan sawah pertanian Karang Tengah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={sawahBanner}
        />
        <div className="absolute inset-0 bg-[#0f1d0b]/75" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(251,252,248,0)_0%,#fbfcf8_100%)]" />

        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b8ee70] backdrop-blur-md">
            <IconSeeding size={16} stroke={1.8} />
            Ketahanan Pangan Desa
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-[0.2px] text-white sm:text-5xl lg:text-[64px] lg:leading-[1.1]">
            Data Pertanian & Hasil Panen Warga.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#d4dec8] sm:text-base">
            Pantau statistik hasil panen, tingkat produktivitas lahan per padukuhan, serta kalkulasi estimasi panen untuk mendukung ketahanan pangan Desa Karangtengah.
          </p>
        </div>
      </section>

      {/* Global Stats Overview */}
      {stats && (
        <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-lg">
                <IconTractor size={32} className="text-[#72b841] mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">Total Laporan</p>
                <p className="mt-1 text-3xl font-extrabold text-[#101708]">{stats.totalRecords}</p>
              </div>
              <div className="rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-lg">
                <IconChartArrowsVertical size={32} className="text-[#0F6B35] mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">Rata-rata Desa</p>
                <p className="mt-1 text-3xl font-extrabold text-[#101708]">{formatDecimal(stats.avgYieldTonHa)} <span className="text-base text-[#6C757D]">Ton/Ha</span></p>
              </div>
              <div className="rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-lg">
                <IconScale size={32} className="text-[#F8CD24] mb-4" />
                <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">Estimasi Panen</p>
                <p className="mt-1 text-3xl font-extrabold text-[#101708]">{formatDecimal(stats.totalEstimatedKg)} <span className="text-base text-[#6C757D]">Kg</span></p>
              </div>
              <div className="rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-lg">
                <IconBug size={32} className="text-orange-500 mb-4" /> {/* Gunakan import IconBug dari tabler/icons-react */}
                <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">Rata-rata Kerugian Hama</p>
                <p className="mt-1 text-3xl font-extrabold text-orange-600">{formatDecimal(stats.avgPestLossPct)}%</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          
          {error ? (
            <div className="rounded-[20px] border border-dashed border-red-200 bg-red-50 p-10 text-center">
              <p className="font-semibold text-red-600">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-12">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[200px] animate-pulse rounded-[20px] bg-[#eef3e8]" />
                ))}
              </div>
              <div className="h-[400px] animate-pulse rounded-[20px] bg-[#eef3e8]" />
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* Statistik Per Padukuhan */}
              {stats?.byPadukuhan && stats.byPadukuhan.length > 0 && (
                <div>
                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
                      Statistik Wilayah
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
                      Hasil Panen per Padukuhan
                    </h2>
                  </div>
                  
                  {/* Grid 3 Kolom untuk Padukuhan */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.byPadukuhan.map((padukuhanStat, index) => (
                      <PadukuhanStatCard key={index} stat={padukuhanStat} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tabel Laporan Panen Terkini */}
              <div>
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
                    Log Data Real-Time
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
                    Laporan Panen Warga
                  </h2>
                </div>

                {harvests.length > 0 ? (
                  <HarvestTable items={harvests} />
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[#bdd9a8] bg-[#f7fbf3] px-6 py-16 text-center">
                    <p className="font-semibold text-[#4f842f]">Belum ada laporan data panen yang tercatat.</p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </section>
    </div>
  );
};