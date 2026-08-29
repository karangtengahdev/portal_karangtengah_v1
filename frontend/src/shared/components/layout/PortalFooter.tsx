import {
  IconArrowRight,
  IconMapPin,
  IconMessageCircle,
  IconPhone,
  IconPlant2,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import villageSawahImage from '../../../assets/karangtengah-sawah.jpg';

type PortalFooterLink = {
  label: string;
  to: string;
};

type PortalFooterProps = {
  className?: string;
  links?: PortalFooterLink[];
  services?: string[];
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaTo?: string;
  address?: string;
  phone?: string;
  backgroundImage?: string;
  wordmark?: string;
};

const defaultLinks: PortalFooterLink[] = [
  { label: 'Beranda', to: '/' },
  { label: 'Berita', to: '/berita' },
  { label: 'Pertanian', to: '/pertanian' },
  { label: 'UMKM', to: '/umkm' },
  { label: 'Infografis', to: '/infografis' },
  { label: 'Kontak', to: '/kontak' },
];

const defaultServices = [
  'Surat Warga',
  'Info Desa',
  'Pertanian',
  'UMKM Lokal',
];

export const PortalFooter = ({
  className,
  links = defaultLinks,
  services = defaultServices,
  heading = 'Butuh informasi atau layanan desa?',
  subheading = 'Hubungi Karangtengah',
  ctaLabel = 'Hubungi Desa',
  ctaTo = '/kontak',
  address = 'Kantor Desa Karang Tengah, Imogiri, Bantul',
  phone = '0812-0000-0000',
  backgroundImage = villageSawahImage,
  wordmark = 'KARANGTENGAH',
}: PortalFooterProps) => {
  const wordmarkLetters = wordmark.split('');

  return (
    <footer
      className={[
        // Hapus 'min-h-screen' dari sini agar tinggi footer menyesuaikan konten
        'overflow-hidden bg-[#030904] text-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="bg-[#030904]">
        <div className="relative min-h-[320px] overflow-hidden bg-[#101708] sm:min-h-[360px] lg:min-h-[400px]">
          <img
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={backgroundImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,4,0.5)_0%,rgba(3,9,4,0.42)_44%,rgba(3,9,4,0.88)_100%)]" />
          <div className="relative mx-auto flex min-h-[320px] max-w-[1440px] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[360px] sm:px-6 lg:px-8">
            <h2 className="footer-editorial-title max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-[58px]">
              {heading}
            </h2>
            <p className="footer-editorial-script mt-1 text-4xl italic leading-none text-[#fff1bf] sm:text-5xl lg:text-[64px]">
              {subheading}
            </p>
            <Link
              className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#b8ee70] bg-[#b8ee70] px-5 text-sm font-bold text-[#0f1d0b] shadow-[0_14px_30px_rgba(184,238,112,0.24)] transition hover:-translate-y-0.5 hover:bg-[#a8e25a]"
              to={ctaTo}
            >
              {ctaLabel}
              <IconMessageCircle size={17} />
            </Link>
          </div>
        </div>

        <div className="relative px-5 pb-0 pt-16 sm:px-8 lg:px-12 lg:pb-0 lg:pt-20">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
            <div>
              <Link className="inline-flex items-center gap-3" to="/">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#72b841] text-white">
                  <IconPlant2 size={24} stroke={1.8} />
                </span>
                <span>
                  <span className="block text-xl font-extrabold tracking-[0.2px]">
                    Karang Tengah
                  </span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#b8ee70]">
                    Portal Desa
                  </span>
                </span>
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                Ruang publik Karang Tengah untuk mengenal kabar desa, layanan
                warga, pertanian, UMKM, dan komunikasi resmi dalam satu tempat.
              </p>
            </div>

            <div>
              <h3 className="footer-column-title text-sm font-bold text-white">
                Jelajah
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-white/56">
                {links.slice(0, 5).map((item) => (
                  <Link
                    className="w-fit transition hover:text-[#b8ee70]"
                    key={item.label}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="footer-column-title text-sm font-bold text-white">
                Layanan
              </h3>
              <div className="mt-5 grid gap-3 text-sm text-white/56">
                {services.map((item) => (
                  <p className="flex gap-3" key={item}>
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b8ee70]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="footer-column-title text-sm font-bold text-white">
                Kontak Desa
              </h3>
              <div className="mt-5 grid gap-4 text-sm leading-6 text-white/56">
                <p className="flex gap-3">
                  <IconMapPin
                    className="mt-0.5 shrink-0 text-[#b8ee70]"
                    size={18}
                  />
                  {address}
                </p>
                <p className="flex gap-3">
                  <IconPhone
                    className="mt-0.5 shrink-0 text-[#b8ee70]"
                    size={18}
                  />
                  {phone}
                </p>
                <Link
                  className="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-white/14 bg-white/6 px-4 text-sm font-semibold text-white transition hover:border-[#b8ee70] hover:bg-[#b8ee70] hover:text-[#0f1d0b]"
                  to={ctaTo}
                >
                  Buka Kontak
                  <IconArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-3 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 Desa Karang Tengah.</p>
            <p>Informasi, layanan, dan potensi lokal.</p>
          </div>

          {/* Bagian Wordmark yang menjadi batas akhir footer */}
          <div className="footer-wordmark-stage mt-8 overflow-hidden">
            <p className="footer-wordmark footer-wordmark-main text-white ">
              {wordmarkLetters.map((letter, index) => (
                <span key={`${letter}-${index}`}>{letter}</span>
              ))}
            </p>
            <div className="footer-reflection-window overflow-hidden">
              <p
                aria-hidden="true"
                className="footer-reflection footer-wordmark footer-wordmark-main text-[35px]"
              >
                {wordmarkLetters.map((letter, index) => (
                  <span key={`reflection-${letter}-${index}`}>{letter}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};