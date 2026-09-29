import {
  IconBuildingCommunity,
  IconChartBar,
  IconHomeStats,
  IconMapPin,
  // IconPlant2,
  IconUsers,
} from '@tabler/icons-react';

import { usePublicVillage } from '../../village/hooks/useVillage';
import { usePublicPadukuhan } from '../../padukuhan/hooks/usePadukuhan';

import sawahBanner from '../../../../assets/karangtengah-sawah.jpg';

export const InfografisPage = () => {
  const { data: village, isLoading: isVillageLoading } = usePublicVillage();
  const { data: padukuhanList, isLoading: isPadukuhanLoading } = usePublicPadukuhan();

  const summaries = [
    {
      label: 'Jumlah Penduduk',
      value: village?.stats?.population?.toLocaleString('id-ID') ?? '-',
      description: 'Total warga tercatat di Kalurahan Karangtengah.',
      icon: IconUsers,
      iconColor: 'text-[#72b841]',
    },
    {
      label: 'Kepala Keluarga',
      value: village?.stats?.families?.toLocaleString('id-ID') ?? '-',
      description: 'Jumlah KK terdaftar.',
      icon: IconHomeStats,
      iconColor: 'text-[#0F6B35]',
    },
    {
      label: 'Luas Wilayah',
      value: village?.stats?.area_ha ? `${village.stats.area_ha.toLocaleString('id-ID')} Ha` : '-',
      description: 'Total luas Kalurahan Karangtengah.',
      icon: IconMapPin,
      iconColor: 'text-[#F8CD24]',
    },
    // {
    //   label: 'Keluarga Petani',
    //   value: village?.stats?.farmer_families?.toLocaleString('id-ID') ?? '-',
    //   description: 'Keluarga dengan mata pencaharian pertanian.',
    //   icon: IconPlant2,
    //   iconColor: 'text-orange-500',
    // },
  ];

  return (
    <div className="bg-[#fbfcf8] text-[#212529]">
      {/* Hero Section */}
      <section className="relative -mt-24 min-h-[480px] overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:min-h-[540px] lg:px-8 lg:pt-40">
        <img
          alt="Hamparan sawah Karangtengah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={sawahBanner}
        />
        <div className="absolute inset-0 bg-[#0f1d0b]/75" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(251,252,248,0)_0%,#fbfcf8_100%)]" />

        <div className="relative mx-auto flex max-w-[1440px] flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#b8ee70] backdrop-blur-md">
            <IconChartBar size={16} stroke={1.8} />
            Infografis
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-[0.2px] text-white sm:text-5xl lg:text-[64px] lg:leading-[1.1]">
            Infografis Padukuhan Karangtengah.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#d4dec8] sm:text-base">
            Data resmi wilayah, penduduk, dan struktur padukuhan
            {village?.lurahName ? ` di bawah kepemimpinan Lurah ${village.lurahName}` : ''}.
          </p>
        </div>
      </section>

      {/* Statistik utama */}
      <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isVillageLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-40 animate-pulse rounded-2xl bg-[#eef3e8]" />
                ))
              : summaries.map((summary) => (
                  <article
                    className="rounded-2xl border border-[#e5ecdf] bg-white p-6 shadow-lg"
                    key={summary.label}
                  >
                    <summary.icon size={32} className={`mb-4 ${summary.iconColor}`} />
                    <p className="text-sm font-bold uppercase tracking-widest text-[#6C757D]">
                      {summary.label}
                    </p>
                    <p className="mt-1 text-3xl font-extrabold text-[#101708]">{summary.value}</p>
                    <p className="mt-3 text-sm leading-6 text-[#6C757D]">{summary.description}</p>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Struktur Padukuhan */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
              <IconBuildingCommunity size={18} />
              Struktur Wilayah
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#101708] sm:text-3xl">
              Struktur Kalurahan ({padukuhanList.length > 0 ? padukuhanList.length : 6} dari 6)
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6C757D]">
              Kalurahan Karangtengah terdiri atas 6 padukuhan. Padukuhan yang belum tercatat
              datanya di sini akan ditambahkan bertahap.
            </p>
          </div>

          {isPadukuhanLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-[120px] animate-pulse rounded-[20px] bg-[#eef3e8]" />
              ))}
            </div>
          ) : padukuhanList.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {padukuhanList.map((p) => (
                <article
                  key={p.id}
                  className="rounded-[20px] border border-[#e5ecdf] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-lg font-extrabold text-[#101708]">{p.name}</h4>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        p.hasData
                          ? 'bg-[#e8f5d9] text-[#4f842f]'
                          : 'bg-[#eef3e8] text-[#6C757D]'
                      }`}
                    >
                      {p.hasData ? 'Aktif' : 'Segera Hadir'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#6C757D]">
                    {p.kepalaDukuh ? `Kepala Dukuh: ${p.kepalaDukuh}` : 'Data Kepala Dukuh belum tersedia'}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#bdd9a8] bg-[#f7fbf3] px-6 py-16 text-center">
              <p className="font-semibold text-[#4f842f]">Data padukuhan belum tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};