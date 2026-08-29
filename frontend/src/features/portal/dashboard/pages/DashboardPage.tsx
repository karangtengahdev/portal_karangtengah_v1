import { useEffect, useRef, useState, useMemo } from 'react';import {
  IconArrowRight,
  IconBuildingCommunity,
  IconBuildingStore,
  IconFileCheck,
  IconHeartHandshake,
  IconHomeStats,
  IconLeaf,
  IconMap2,
  IconMapPin,
  IconPhone,
  IconPlant2,
  IconShieldCheck,
  IconUsers,
  IconWheat,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { usePublicBerita } from '../../../portal/berita/hooks/useBerita';
import { formatBeritaDate } from '../../../nawasena/berita/utils/formatBerita';
import kepalaDesaImage from '../../../../assets/kepala-desa.png';
import villageSawahImage from '../../../../assets/karangtengah-sawah.jpg';
import pemudaDesaImage from '../../../../assets/pemuda-desa.png';
import layananInfoDesaImage from '../../../../assets/services/layanan-info-desa.png';
import layananPertanianImage from '../../../../assets/services/layanan-pertanian.png';
import layananSuratWargaImage from '../../../../assets/services/layanan-surat-warga.png';
import layananUmkmImage from '../../../../assets/services/layanan-umkm.png';

const stats = [
  {
    title: 'Jumlah Penduduk',
    value: '3.250',
    unit: 'Jiwa',
    icon: IconUsers,
  },
  {
    title: 'Kepala Keluarga',
    value: '890',
    unit: 'KK',
    icon: IconHomeStats,
  },
  {
    title: 'Luas Sawah',
    value: '78',
    unit: 'Ha',
    icon: IconWheat,
  },
  {
    title: 'Luas Wilayah',
    value: '125',
    unit: 'Ha',
    icon: IconMapPin,
  },
  {
    title: 'Wilayah',
    value: '24/6',
    unit: 'RT/RW',
    // secondaryValue: '6',
    // secondaryUnit: 'RW',
    icon: IconBuildingCommunity,
  },
];

const serviceCards = [
  {
    number: '01',
    title: 'Surat Warga',
    detail:
      'Cek syarat dan alur pengajuan surat domisili, keterangan usaha, serta pengantar umum sebelum datang ke kantor desa.',
    image: layananSuratWargaImage,
    imageAlt: 'Suasana desa dan warga untuk layanan surat warga',
    imageClassName: 'object-center',
  },
  {
    number: '02',
    title: 'Info Desa',
    detail:
      'Pengumuman pelayanan, agenda kegiatan, kabar dusun, dan informasi penting yang perlu diketahui warga.',
    image: layananInfoDesaImage,
    imageAlt: 'Pemuda desa sebagai penggerak informasi warga',
    imageClassName: 'object-top',
  },
  {
    number: '03',
    title: 'Pertanian',
    detail:
      'Data komoditas, kelompok tani, program pertanian, dan potensi sawah desa dalam satu ruang baca.',
    image: layananPertanianImage,
    imageAlt: 'Hamparan sawah sebagai potensi pertanian Karang Tengah',
    imageClassName: 'object-center',
  },
  {
    number: '04',
    title: 'UMKM Lokal',
    detail:
      'Etalase produk warga, profil usaha, dan kontak pelaku UMKM Karangtengah untuk promosi lokal.',
    image: layananUmkmImage,
    imageAlt: 'Produk dan pasar lokal untuk direktori UMKM Karang Tengah',
    imageClassName: 'object-center',
  },
];

const leadershipValues = [
  {
    title: 'Transparan',
    detail: 'Informasi desa terbuka dan dapat diakses oleh semua warga.',
    icon: IconShieldCheck,
  },
  {
    title: 'Melayani',
    detail: 'Pelayanan cepat, ramah, dan berorientasi pada kebutuhan warga.',
    icon: IconHeartHandshake,
  },
  {
    title: 'Berkelanjutan',
    detail: 'Pembangunan berkelanjutan untuk desa yang hijau and mandiri.',
    icon: IconPlant2,
  },
];

const growthStats = [
  {
    value: 10,
    prefix: '+',
    suffix: '%',
    label: 'Panen meningkat',
    detail: 'Produktivitas pertanian warga dalam periode pendataan terbaru.',
    icon: IconPlant2,
  },
  {
    value: 24,
    suffix: '',
    unit: 'UMKM',
    label: 'Usaha warga aktif',
    detail: 'Pelaku usaha lokal yang mulai terdata dan siap dipromosikan.',
    icon: IconBuildingStore,
  },
  {
    value: 186,
    suffix: '+',
    label: 'Layanan terbantu',
    detail: 'Kebutuhan administrasi dan informasi warga yang tertangani.',
    icon: IconFileCheck,
  },
];

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  className,
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasStartedRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    hasStartedRef.current = false;

    const startAnimation = () => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplayValue(value);
        return;
      }

      const startedAt = performance.now();

      const animate = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.round(value * easedProgress));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    const element = elementRef.current;

    if (!element || !('IntersectionObserver' in window)) {
      startAnimation();
      return undefined;
    }

    let observer: IntersectionObserver | null = null;

    const isElementVisible = () => {
      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      return rect.top < viewportHeight * 0.9 && rect.bottom > 0;
    };

    const stopWatching = () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleVisibilityCheck);
      window.removeEventListener('resize', handleVisibilityCheck);
    };

    const handleVisibilityCheck = () => {
      if (isElementVisible()) {
        startAnimation();
        stopWatching();
      }
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          stopWatching();
        }
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    );

    observer.observe(element);
    window.addEventListener('scroll', handleVisibilityCheck, {
      passive: true,
    });
    window.addEventListener('resize', handleVisibilityCheck);
    requestAnimationFrame(handleVisibilityCheck);

    return () => {
      stopWatching();

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, value]);

  return (
    <span className={className} ref={elementRef}>
      {prefix}
      {displayValue.toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x450/e9f1e2/72b841?text=Desa+Karangtengah';

export const DashboardPage = () => {
  const { data: beritaItems, isLoading: isBeritaLoading } = usePublicBerita();

  const homepageBerita = useMemo(() => {
    return beritaItems.slice(0, 6);
  }, [beritaItems]);

  return (
    <div className="bg-white">
      <section className="relative bg-white pb-16">
        <div className="relative min-h-[720px] overflow-hidden rounded-b-[48px] bg-[#eaf5df] px-4 pb-44 pt-20 text-[#071205] sm:px-6 lg:min-h-[720px] lg:px-8 lg:pb-52 lg:pt-24">
          <div className="absolute inset-0">
            <img
              alt=""
              className="hero-background-slide hero-background-still object-bottom opacity-100 saturate-[1.08] contrast-[1.06] brightness-[1.02]"
              src={villageSawahImage}
            />
          </div>
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(16,23,8,0.28)_0%,rgba(16,23,8,0)_100%)]" />

          <div className="relative mx-auto flex min-h-[500px] max-w-[1440px] flex-col justify-center lg:min-h-[500px]">
            <div>
              <h1 className="hero-editorial-title max-w-[1380px] text-[35px] leading-[0.85] text-[#fff1bf] sm:text-[86px] md:text-[112px] lg:text-[128px] xl:text-[138px]">
                KARANGTENGAH
              </h1>

              <p className="hero-editorial-script mt-1 text-[24px] leading-[0.95] text-[#fff1bf] sm:text-[72px] md:text-[88px] lg:mt-2 lg:text-left lg:text-[60px] xl:text-[70px]">
                Tumbuh bersama warga
              </p>

              <div className="mt-5 grid gap-6 lg:grid-cols-[0.27fr_0.73fr] lg:items-start">
                <div className="max-w-sm">
                  <p className="hero-editorial-copy max-w-[330px] text-xs font-semibold leading-5 text-[#fff8dd] sm:text-sm sm:leading-6">
                    Dari persawahan, usaha warga, hingga pelayanan desa, Karang
                    Tengah terus tumbuh sebagai ruang hidup yang dekat, terbuka,
                    dan saling menguatkan.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      className="inline-flex h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#4f842f] bg-[#4f842f] px-4 text-xs font-bold shadow-[0_10px_24px_rgba(79,132,47,0.24)] ring-1 ring-white/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4f842f]/90 sm:text-sm"
                      to="/infografis"
                    >
                      <span className="text-white">See Infografis</span>
                      <IconArrowRight size={16}  className="text-white"/>
                    </Link>

                    <Link
                      className="inline-flex h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#d4dec8] bg-white/62 px-4 text-xs font-bold text-[#263126] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4f842f] hover:bg-[#f1f5eb] hover:text-[#4f842f] sm:text-sm"
                      to="/kontak"
                    >
                      Hubungi Desa
                      <IconPhone size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ini section statistik */}
        <div className="village-stats-wrap">
          <section aria-labelledby="village-stats-title" className="village-stats-panel">
            <div className="village-stats-heading">
              <h2 id="village-stats-title">Karangtengah Dalam Angka</h2>
              <div aria-hidden="true" className="village-stats-title-mark">
                <span />
                <IconLeaf size={16} stroke={1.7} />
                <span />
              </div>
              <p>Gambaran singkat wilayah, penduduk, dan potensi desa.</p>
            </div>

            <div className="village-stats-grid">
              {stats.map((item) => (
                <article className="village-stat-item" key={item.title}>
                  <div className="village-stats-icon">
                    <item.icon size={35} stroke={1.75} />
                  </div>
                  <div className="village-stat-value">
                    <strong>{item.value}</strong>
                    <span>{item.unit}</span>
                    {/* {'secondaryValue' in item ? (
                      <>
                        <em aria-hidden="true" />
                        <strong>{item.secondaryValue}</strong>
                        <span>{item.secondaryUnit}</span>
                      </>
                    ) : null} */}
                  </div>
                  <span className="village-stat-accent" />
                  <p className="village-stat-label">{item.title}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="leadership-section -mt-9">
        <div className="leadership-bottom-wave" />
        <div className="leadership-dot-pattern" />

        <svg
          aria-hidden="true"
          className="leadership-topography"
          fill="none"
          viewBox="0 0 300 300"
        >
          <path d="M22 88c44-54 126-72 190-35 42 25 62 75 45 118-18 46-70 74-123 68-54-7-95-47-105-94-4-20-1-40 11-57" />
          <path d="M26 98c34-42 99-56 150-27 34 20 50 59 37 93-14 36-55 59-97 54-43-5-76-37-84-75-3-16 0-31 9-45" />
          <path d="M72 108c25-30 72-40 109-19 25 15 37 44 27 69-10 27-40 44-72 40-31-4-56-27-62-55-2-12 0-24 7-35" />
          <path d="M98 119c15-18 44-24 67-11 15 9 22 27 17 42-7 17-25 27-44 25-19-2-34-16-38-34-1-7 0-15 5-22" />
          <path d="M121 130c8-10 24-13 36-6 8 5 12 14 9 22-3 9-13 15-23 13-10-1-18-8-20-18-1-4 0-8 3-11" />
        </svg>

        <div className="leadership-container">
          <div className="leadership-main">
            <div className="leadership-portrait-area">
              <div className="leadership-portrait-circle" />
              <div className="leadership-landscape-shape">
                <img
                  alt=""
                  className="h-full w-full object-cover object-center"
                  src={villageSawahImage}
                />
              </div>
              <img
                alt="Kepala Desa Karang Tengah"
                className="leadership-leader-image"
                src={kepalaDesaImage}
              />
              <div className="leadership-portrait-badge">
                <span className="leadership-portrait-badge-icon">
                  <IconLeaf size={28} stroke={1.8} />
                </span>
                <span>
                  <span>Bersama membangun desa</span>
                  <strong>yang terbuka & berdaya</strong>
                </span>
              </div>
            </div>

            <div className="leadership-content">
              <p className="leadership-eyebrow">
                <IconLeaf size={14} stroke={1.9} />
                <span>Sambutan Kepala Desa</span>
              </p>
              <h2 className="leadership-title">
                Membangun Karang Tengah
                <br />
                Bersama,{' '}
                <em className="leadership-title-highlight">untuk Semua.</em>
              </h2>

              <p className="leadership-copy">
                Selamat datang di portal resmi Desa Karang Tengah. Kami hadir
                dengan semangat keterbukaan informasi, pelayanan yang mudah, dan
                komitmen untuk terus mendorong kemajuan desa melalui kolaborasi
                dan gotong royong.
              </p>

              <figure className="leadership-quote-card">
                <span className="leadership-quote-mark">&ldquo;</span>
                <blockquote>
                  Kami ingin Karang Tengah tumbuh sebagai desa yang terbuka,
                  tertata, dan mampu mengangkat potensi warganya melalui
                  informasi yang mudah dijangkau dan pelayanan yang tulus.
                </blockquote>
                <figcaption className="leadership-author">
                  <span className="leadership-signature">Ahmad Pratama</span>
                  <span className="leadership-author-divider" />
                  <span>
                    <strong>Ahmad Pratama</strong>
                    <small>Kepala Desa Karang Tengah</small>
                  </span>
                </figcaption>
              </figure>

              <div className="leadership-cta-group">
                <Link
                  className="leadership-button leadership-button-primary"
                  to="/infografis"
                >
                  <IconMap2 size={17} stroke={1.8} />
                  Jelajahi Profil Desa
                </Link>
                <Link
                  className="leadership-button leadership-button-secondary"
                  to="/kontak"
                >
                  <IconFileCheck size={17} stroke={1.8} />
                  Layanan untuk Warga
                </Link>
              </div>
            </div>
          </div>

          <div className="leadership-value-grid">
            {leadershipValues.map((item) => (
              <article
                className="leadership-value-card"
                key={item.title}
              >
                <span className="leadership-value-icon">
                  <item.icon size={34} stroke={1.7} />
                </span>
                <span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <Link to="/infografis">
                    Selengkapnya <IconArrowRight size={13} stroke={1.8} />
                  </Link>
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="service-editorial-title text-4xl font-extrabold leading-tight text-[#101708] sm:text-5xl lg:text-[56px]">
              Urus kebutuhan desa tanpa muter-muter
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {serviceCards.map((service, index) => (
          <article
            className="flex min-h-[260px] flex-col rounded-lg bg-[#F7F7F4] p-3 shadow-[0_10px_30px_rgba(16,23,8,0.05)] ring-1 ring-black/[0.03] sm:min-h-[390px] sm:p-5"
            key={service.title}
          >
            <div className={index % 2 === 0 ? 'mt-4 sm:mt-12' : ''}>
              <img
                alt={service.imageAlt}
                className={[
                  'aspect-[16/10] h-[90px] w-full rounded-md object-cover sm:h-auto',
                  service.imageClassName,
                ].join(' ')}
                src={service.image}
              />
            </div>

            <h3 className="service-card-title mt-3 text-sm font-bold leading-tight text-[#101708] sm:mt-5 sm:text-xl">
              {service.title}
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#555555] sm:mt-3 sm:text-sm sm:leading-6">
              {service.detail}
            </p>
          </article>
        ))}
      </div>
        </div>
      </section>

      {/* Pertumbuhan Desa */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 -mt-15">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#72b841]">
              <span className="h-6 w-1 rounded-full bg-[#72b841]" />
              Pertumbuhan Desa
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[0.2px] text-[#212529] sm:text-4xl lg:text-5xl">
              Pertanian, UMKM, dan layanan warga bergerak semakin maju.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#555555] sm:text-base">
              Karang Tengah terus mendorong perkembangan desa melalui pendataan
              potensi lokal, dukungan usaha warga, dan pelayanan publik yang
              lebih mudah dijangkau masyarakat.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-7">
              {growthStats.map((item) => (
                <article className="min-w-0" key={item.label}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#72b841]/10 text-[#72b841] sm:h-12 sm:w-12">
                      <item.icon size={18} stroke={1.7} className="sm:hidden" />
                      <item.icon size={26} stroke={1.7} className="hidden sm:block" />
                    </div>
                    <div className="flex min-w-0 items-baseline gap-1 text-2xl font-extrabold leading-none tracking-[0.2px] text-[#27441d] sm:gap-1.5 sm:text-[42px] xl:text-5xl">
                      <AnimatedNumber
                        className="inline-block whitespace-nowrap tabular-nums"
                        prefix={item.prefix}
                        suffix={item.suffix}
                        value={item.value}
                      />
                      {'unit' in item ? (
                        <span className="text-xs font-bold text-[#27441d] sm:text-lg">
                          {item.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <h3 className="mt-2 text-[11px] font-semibold leading-tight text-[#212529] sm:mt-4 sm:text-base">
                    {item.label}
                  </h3>
            <p className="mt-1 text-[10px] leading-4 text-[#6C757D] sm:mt-2 sm:text-sm sm:leading-6">
              {item.detail}
            </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[36px] -top-30">  {/* bg-white */}
            {/* <div className="absolute inset-x-8 bottom-8 top-28 rounded-[32px] bg-[linear-gradient(180deg,#72b841_0%,#5fa333_100%)]" />
            <div className="absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#e9efdc]/80 blur-3xl" /> */}
            <img
              alt="Pemuda Desa Karang Tengah"
              className="relative z-10 mx-auto h-full min-h-[420px] w-full object-contain object-bottom"
              src={pemudaDesaImage}
            />
          </div>
        </div>
      </section>

      {/* Bagian Berita Utama Dashboard */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 -mt-30">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#555555]">
                <span className="h-6 w-1 rounded-full bg-[#72b841]" />
                <IconPlant2 className="text-[#72b841]" size={18} />
                Artikel dan Berita
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-[#212529] sm:text-4xl">
                Kabarkarang Tengah terkini
              </h2>
            </div>
            <Link
              className="inline-flex h-9 w-fit items-center gap-2 rounded-full bg-[#72b841] px-4 text-sm font-medium text-white transition hover:bg-[#5fa333]"
              to="/berita"
            >
              Lainnya
              <IconArrowRight size={17} />
            </Link>
          </div>

          {isBeritaLoading ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="animate-pulse rounded-[16px] bg-[#eef3e8] min-h-[220px] sm:min-h-[300px]"
                  key={`berita-skeleton-${index}`}
                />
              ))}
            </div>
          ) : homepageBerita.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-3">
              {homepageBerita.slice(0, 6).map((item) => (
                <Link
                  className="group relative block overflow-hidden rounded-[14px] sm:rounded-[16px] bg-[#101708] shadow-[0_4px_12px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(16,23,8,0.18)] flex flex-col"
                  key={item.id}
                  to={`/berita/${item.slug}`}
                >
                  {/* Gambar */}
                  <div className="relative w-full overflow-hidden bg-[#eef3e8]">
                    <img
                      alt={item.title}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                      src={item.coverUrl || PLACEHOLDER_IMAGE}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,23,8,0)_18%,rgba(16,23,8,0.15)_48%,rgba(16,23,8,0.55)_100%)]" />
                  </div>

                  {/* Box info — transparan buram */}
                  <div className="absolute inset-x-2 bottom-2 rounded-[11px] bg-white/70 p-3 text-[#101708] shadow-[0_8px_24px_rgba(0,0,0,0.10)] backdrop-blur-md sm:inset-x-3 sm:bottom-3 sm:rounded-[14px] sm:p-5">
                    <h3 className="mt-1 line-clamp-2 text-[10px] font-bold leading-tight text-[#101708] sm:mt-2 sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[6px] text-[#6C757D] sm:mt-3 sm:text-sm">
                      {formatBeritaDate(item.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[16px] border border-dashed border-[#b9d8a4] bg-[#f7fbf3] px-6 py-10 text-center">
              <p className="text-sm font-semibold text-[#4f842f]">
                Belum ada berita terbit untuk ditampilkan.
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};