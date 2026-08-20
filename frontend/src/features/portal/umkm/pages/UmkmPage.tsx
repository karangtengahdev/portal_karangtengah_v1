import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IconArrowRight,
  IconBottle,
  IconBowlSpoon,
  IconBuildingStore,
  IconLeaf,
  IconPlant2,
  IconShoppingBag,
  IconUsers,
} from '@tabler/icons-react';

import umkmBannerImage from '../../../../assets/umkm-banner-karangtengah.png';
import { usePublicUmkm } from '../hooks/useUmkm';

const getCategoryConfig = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (name.includes('makanan')) {
    return { icon: IconBowlSpoon, color: 'bg-[#F8CD24]/16 text-[#27441d]', desc: 'Camilan dan olahan pangan warga.', bg:'bg-[#FFF8E1]' };
  }
  if (name.includes('minuman') || name.includes('herbal')) {
    return { icon: IconBottle, color: 'bg-[#72b841]/14 text-[#3D7A22]', desc: 'Jamu, wedang, dan minuman sehat.', bg: 'bg-[#E8F5E9]', };
  }
  if (name.includes('kerajinan')) {
    return { icon: IconBuildingStore, color: 'bg-[#72b841]/10 text-[#0F6B35]', desc: 'Anyaman, bambu, dan karya rumahan.', bg: 'bg-[#E8F5E9]' };
  }
  if (name.includes('fashion') || name.includes('batik')) {
    return { icon: IconShoppingBag, color: 'bg-[#1A3A68]/10 text-[#1A3A68]', desc: 'Batik, jahit, dan produk sandang.', bg: 'bg-[#E8EAF6]' };
  }
  if (name.includes('tani') || name.includes('pertanian')) {
    return { icon: IconPlant2, color: 'bg-[#72b841]/16 text-[#2F6D18]', desc: 'Produk segar dan olahan pertanian.', bg: 'bg-[#E8F5E9]' };
  }

  return { icon: IconUsers, color: 'bg-[#F8F9FA] text-[#555555]', desc: 'Layanan warga dan usaha keluarga.', bg: 'bg-[#F5F5F5]' };
};

export const UmkmPage = () => {
  const { data: umkms, isLoading } = usePublicUmkm();

  const dynamicCategories = useMemo(() => {
    if (!umkms || umkms.length === 0) return [];

    const uniqueCategories = Array.from(new Set(umkms.map((item) => item.category || 'Umum')));

    return uniqueCategories.map((cat) => ({
      label: cat,
      ...getCategoryConfig(cat),
    }));
  }, [umkms]);

  return (
    <div className="bg-white text-[#212529]">
      <section className="relative min-h-[690px] overflow-hidden px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:min-h-[760px] lg:px-8 lg:pt-40">
        <img
          alt="Banner produk UMKM Desa Karang Tengah"
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={umkmBannerImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.76)_34%,rgba(255,255,255,0.16)_62%,rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#ffffff_100%)]" />

        <div className="relative mx-auto flex min-h-[500px] max-w-[1440px] items-center lg:min-h-[560px]">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#72b841]/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2F6D18]">
              <IconLeaf size={16} stroke={1.8} />
              Bangga produk desa
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[0.2px] text-[#12351F] sm:text-5xl lg:text-[64px] lg:leading-[1.06]">
              Produk lokal desa, kualitas naik kelas.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#555555] sm:text-base">
              Etalase produk warga Desa Karang Tengah, Imogiri, Bantul:
              makanan ringan, minuman herbal, hasil tani, batik, dan kerajinan
              rumahan.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row ">
              <a
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0F6B35] px-5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(15,107,53,0.22)] transition hover:bg-[#0B5B2D]"
                href="#produk-umkm"
              >
                <IconShoppingBag size={18} className='text-white'/>
                <span className='text-white'>Lihat produk</span>
              </a>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#0F6B35]/20 bg-white/82 px-5 text-sm font-semibold text-[#0F6B35] shadow-[0_8px_22px_rgba(16,23,8,0.08)] backdrop-blur transition hover:border-[#0F6B35]/38 hover:bg-white"
                to="/kontak"
              >
                <IconBuildingStore size={18} />
                Daftarkan UMKM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
       <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
              Kategori pilihan
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#212529] sm:text-3xl">
              Pilih jenis produk UMKM Karangtengah.
            </h2>
          </div>
          <Link
            className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-[#F8CD24] px-4 text-sm font-semibold text-[#101708] transition hover:bg-[#E6B800]"
            to="/kontak"
          >
            Kontak pengelola
            <IconArrowRight size={17} />
          </Link>
        </div>
 
        {isLoading ? (
          <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 animate-pulse rounded-full bg-[#F0F0F0] sm:h-16 sm:w-16" />
                <div className="h-3 w-12 animate-pulse rounded bg-[#F0F0F0]" />
              </div>
            ))}
          </div>
        ) : dynamicCategories.length > 0 ? (
          <div className="mt-6 grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {dynamicCategories.map((category) => (
              <button
                key={category.label}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`grid h-14 w-14 place-items-center rounded-full ${category.bg} transition duration-200 group-hover:scale-105 group-hover:shadow-md sm:h-16 sm:w-16`}
                >
                  <category.icon
                    size={24}
                    stroke={1.7}
                    className={`${category.color} sm:hidden`}
                  />
                  <category.icon
                    size={28}
                    stroke={1.7}
                    className={`${category.color} hidden sm:block`}
                  />
                </div>
                <span className="max-w-[72px] text-center text-[11px] font-medium leading-tight text-[#212529] capitalize sm:text-xs">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[16px] border border-dashed border-[#EFEFEF] bg-white px-6 py-10 text-center">
            <p className="text-sm font-semibold text-[#6C757D]">Belum ada kategori UMKM yang terdaftar.</p>
          </div>
        )}
      </div>
    </section>

      {/* Products/UMKM Section */}
      <section
        className="px-4 py-10 sm:px-6 lg:px-8"
        id="produk-umkm"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#72b841]">
                Produk unggulan
              </p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight text-[#212529] sm:text-4xl">
                Etalase produk lokal desa.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6C757D]">
              Jelajahi berbagai UMKM dan produk berkualitas yang ditawarkan langsung oleh warga Desa Karangtengah.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-3 grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="min-h-[280px] animate-pulse rounded-[12px] bg-[#F8F9FA]"
                  key={`umkm-page-skeleton-${index}`}
                />
              ))}
            </div>
          ) : umkms.length > 0 ? (
            <div className="mt-8 grid gap-3 grid-cols-2 lg:grid-cols-3">
              {umkms.map((item) => (
                <article
                  className="group overflow-hidden rounded-[12px] border border-[#EFEFEF] bg-white shadow-[0_8px_24px_rgba(16,23,8,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(16,23,8,0.14)] flex flex-col"
                  key={item.id}
                >
                  {/* Gambar cover */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F9FA]">
                    {item.coverUrl ? (
                      <img
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={item.coverUrl}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#ADB5BD] transition duration-500 group-hover:scale-105">
                        <IconBuildingStore size={36} stroke={1.2} />
                      </div>
                    )}
                    <div className="absolute left-2 top-2 rounded-full bg-[#0F6B35] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-[0_8px_18px_rgba(16,23,8,0.18)]">
                      Tersedia
                    </div>
                  </div>

                  {/* Konten card */}
                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#72b841]">
                      {item.category || 'Umum'}
                    </p>
                    <h3 className="mt-1.5 text-sm sm:text-lg font-bold leading-snug text-[#212529]">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#6C757D] flex-1">
                      {item.ownerName}
                    </p>

                    <div className="mt-3 sm:mt-5 flex items-center justify-between gap-2 border-t border-[#F8F9FA] pt-3 sm:pt-4">
                      <p className="text-xs sm:text-sm font-extrabold text-[#0F6B35] truncate">
                        {item.contactPhone || 'Hubungi UMKM'}
                      </p>
                      <Link
                        aria-label={`Tanyakan ${item.name}`}
                        className="inline-flex h-8 sm:h-10 items-center justify-center gap-1 rounded-full border border-[#0F6B35]/18 bg-[#0F6B35]/8 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-[#0F6B35] transition hover:bg-[#0F6B35] hover:text-white shrink-0"
                        to={`https://wa.me/${item.contactPhone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                      >
                        Detail
                        <IconArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[16px] border border-dashed border-[#EFEFEF] bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[#6C757D]">
                Belum ada produk UMKM yang terdaftar saat ini.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};