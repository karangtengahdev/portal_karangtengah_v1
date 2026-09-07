import {
  IconBuildingCommunity,
  IconHomeStats,
  IconMapPin,
  IconPlant2,
  IconUsers,
} from '@tabler/icons-react';

import { usePublicVillage } from '../../village/hooks/useVillage';
import { usePublicPadukuhan } from '../../padukuhan/hooks/usePadukuhan';

export const InfografisPage = () => {
  const { data: village, isLoading: isVillageLoading } = usePublicVillage();
  const { data: padukuhanList, isLoading: isPadukuhanLoading } = usePublicPadukuhan();

  const summaries = [
    {
      label: 'Jumlah Penduduk',
      value: village?.stats?.population?.toLocaleString('id-ID') ?? '-',
      description: 'Total warga tercatat di Kalurahan Karangtengah.',
      icon: IconUsers,
    },
    {
      label: 'Kepala Keluarga',
      value: village?.stats?.families?.toLocaleString('id-ID') ?? '-',
      description: 'Jumlah KK terdaftar.',
      icon: IconHomeStats,
    },
    {
      label: 'Luas Wilayah',
      value: village?.stats?.area_ha ? `${village.stats.area_ha.toLocaleString('id-ID')} Ha` : '-',
      description: 'Total luas Kalurahan Karangtengah.',
      icon: IconMapPin,
    },
    {
      label: 'Keluarga Petani',
      value: village?.stats?.farmer_families?.toLocaleString('id-ID') ?? '-',
      description: 'Keluarga dengan mata pencaharian pertanian.',
      icon: IconPlant2,
    },
  ];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Infografis
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
            Infografis Kalurahan Karangtengah
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Data resmi wilayah, penduduk, dan struktur padukuhan
            {village?.lurahName ? ` di bawah kepemimpinan Lurah ${village.lurahName}` : ''}.
          </p>
        </div>

        {/* Statistik utama */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isVillageLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-32 animate-pulse rounded-lg bg-neutral-100" />
              ))
            : summaries.map((summary) => (
                <article
                  className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
                  key={summary.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">{summary.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-neutral-950">{summary.value}</p>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-700">
                      <summary.icon size={22} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-600">{summary.description}</p>
                </article>
              ))}
        </section>

        {/* Struktur Padukuhan */}
        <section className="mt-12">
          <div className="flex items-center gap-2">
            <IconBuildingCommunity className="text-emerald-700" size={22} />
            <h3 className="text-xl font-semibold text-neutral-950">
              Struktur Padukuhan ({padukuhanList.length > 0 ? padukuhanList.length : 6} dari 6)
            </h3>
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            Kalurahan Karangtengah terdiri atas 6 padukuhan. Padukuhan yang belum tercatat
            datanya di sini akan ditambahkan bertahap.
          </p>

          {isPadukuhanLoading ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-20 animate-pulse rounded-lg bg-neutral-100" />
              ))}
            </div>
          ) : padukuhanList.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {padukuhanList.map((p) => (
                <article
                  key={p.id}
                  className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-neutral-950">{p.name}</h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        p.hasData
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {p.hasData ? 'Aktif' : 'Segera Hadir'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    {p.kepalaDukuh ? `Kepala Dukuh: ${p.kepalaDukuh}` : 'Data Kepala Dukuh belum tersedia'}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="text-sm text-neutral-500">Data padukuhan belum tersedia.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
