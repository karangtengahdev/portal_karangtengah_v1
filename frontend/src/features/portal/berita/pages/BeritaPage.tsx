import { useMemo, useState } from 'react';
import {
  IconArrowRight,
  IconCategory,
  IconFileCheck,
  IconLayoutGrid,
  IconNews,
  IconPlant2,
  IconSearch,
  IconUsers,
  IconBuildingStore,
} from '@tabler/icons-react';

import beritaBannerImage from '../../../../assets/berita-banner-karangtengah.png';
import { usePublicBerita } from '../hooks/useBerita';
import { PublicBeritaCard } from '../components/PublicBeritaCard';

const allCategory = 'Semua';

const getCategoryIcon = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  if (normalizedCategory.includes('pertanian')) return IconPlant2;
  if (normalizedCategory.includes('umkm')) return IconBuildingStore;
  if (normalizedCategory.includes('kegiatan')) return IconUsers;
  if (normalizedCategory.includes('layanan')) return IconFileCheck;
  if (normalizedCategory === allCategory.toLowerCase()) return IconLayoutGrid;
  return IconCategory;
};

export const BeritaPage = () => {
  const { data: beritaItems, isLoading } = usePublicBerita();
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [query, setQuery] = useState('');

  const categories = useMemo(
    () => [
      allCategory,
      ...Array.from(new Set(beritaItems.map((item) => item.category || 'Umum'))),
    ],
    [beritaItems],
  );

  const filteredBerita = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return beritaItems.filter((item) => {
      const itemCategory = item.category || 'Umum';
      const itemAuthor = item.author || 'Admin';

      const matchesCategory =
        activeCategory === allCategory || itemCategory === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.excerpt, itemCategory, itemAuthor]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, beritaItems, query]);

  return (
    <div className="bg-white text-[#212529]">
      {/* Hero Section — pakai banner statis, bukan gambar berita yang diupload */}
<section className="relative -mt-24 min-h-[480px] overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:min-h-[540px] lg:px-8 lg:pt-40">        <img
          alt="Banner berita Desa Karang Tengah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={beritaBannerImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.76)_34%,rgba(255,255,255,0.16)_62%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#ffffff_100%)]" />

        <div className="relative mx-auto flex min-h-[300px] max-w-[1440px] items-center lg:min-h-[340px]">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#72b841]/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2F6D18]">
              <IconNews size={16} stroke={1.8} />
              Berita Desa
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[0.2px] text-[#12351F] sm:text-5xl lg:text-[58px] lg:leading-[1.06]">
              Kabar terbaru Karang Tengah.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#555555] sm:text-base">
              Informasi resmi seputar pemerintahan, layanan warga, pertanian,
              UMKM, dan kegiatan desa yang sudah dipublikasikan.
            </p>

            <label className="mt-7 flex h-14 w-full max-w-[460px] items-center gap-3 rounded-full border border-[#0F6B35]/16 bg-white px-5 text-sm text-[#687063] shadow-[0_12px_28px_rgba(16,23,8,0.10)] focus-within:ring-4 focus-within:ring-[#72b841]/24">
              <IconSearch className="shrink-0 text-[#72b841]" size={21} />
              <input
                className="h-full w-full bg-transparent text-[#212529] outline-none placeholder:text-[#87907f]"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul, kategori, atau penulis"
                type="search"
                value={query}
              />
            </label>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex gap-3 overflow-x-auto pb-3">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              const CategoryIcon = getCategoryIcon(category);

              return (
                <button
                  className={[
                    'inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-bold shadow-[0_8px_18px_rgba(16,23,8,0.05)] transition',
                    isActive
                      ? 'border-[#72b841] bg-[#72b841] text-white'
                      : 'border-[#e1e8dc] bg-white text-[#3d453b] hover:border-[#72b841] hover:text-[#4f842f]',
                  ].join(' ')}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                >
                  <CategoryIcon size={18} stroke={1.9} />
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Berita Grid */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
                Berita terbaru
              </p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-[#212529] sm:text-4xl">
                Semua publikasi desa.
              </h2>
            </div>

            <button
              className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-[#dce9d4] bg-white px-4 text-sm font-bold text-[#4f842f] shadow-[0_8px_18px_rgba(16,23,8,0.04)] transition hover:border-[#72b841]"
              onClick={() => {
                setActiveCategory(allCategory);
                setQuery('');
              }}
              type="button"
            >
              Lihat semua berita
              <IconArrowRight size={17} />
            </button>
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="min-h-[220px] animate-pulse rounded-[16px] bg-[#eef3e8] sm:min-h-[340px] sm:rounded-[22px]"
                  key={`berita-page-skeleton-${index}`}
                />
              ))}
            </div>
          ) : filteredBerita.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
              {filteredBerita.map((item) => (
                <PublicBeritaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[18px] border border-dashed border-[#bdd9a8] bg-white px-6 py-16 text-center">
              <p className="text-sm font-semibold text-[#4f842f]">
                Belum ada berita yang cocok dengan filter ini.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};