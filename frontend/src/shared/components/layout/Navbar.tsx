import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  IconBuildingStore,
  IconCalendarEvent,
  IconChartBar,
  IconHome,
  IconMenu2,
  IconNews,
  IconPlant2,
  IconPhone,
  IconSeeding,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';

const navigation = [
  {
    label: 'Beranda',
    href: '/',
    icon: IconHome,
  },
  {
    label: 'Berita',
    href: '/berita',
    icon: IconNews,
  },
  {
    label: 'Pertanian',
    href: '/pertanian',
    icon: IconPlant2,
  },
  {
    label: 'Jadwal Tanam',
    href: '/jadwal-tanam',
    icon: IconCalendarEvent,
  },
  {
    label: 'UMKM',
    href: '/umkm',
    icon: IconBuildingStore,
  },
  {
    label: 'Infografis',
    href: '/infografis',
    icon: IconChartBar,
  },
  {
    label: 'Kontak',
    href: '/kontak',
    icon: IconPhone,
  },
];

const nawasenaLink = {
  label: 'Nawasena',
  href: '/nawasena',
  icon: IconSparkles,
};

const getNavLinkClass = (
  isScrolled: boolean,
  isTransparent: boolean,
) =>
  [
    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors duration-500 ease-out',
    isTransparent
      ? 'text-white/90 hover:bg-white/12 hover:text-white'
      : isScrolled
        ? 'text-[#212529] hover:bg-white/70'
        : 'text-[#212529] hover:bg-[#72b841]/8',
  ].join(' ');

const getNavIconClass = (isActive: boolean, isTransparent: boolean) =>
  [
    'shrink-0 transition-colors duration-500 ease-out',
    isActive
      ? isTransparent
        ? 'text-[#F8CD24]'
        : 'text-[#72b841]'
      : isTransparent
        ? 'text-white/90'
        : 'text-[#212529]',
  ].join(' ');

type NawasenaPillStyle = CSSProperties & {
  '--nawasena-bg': string;
  '--nawasena-border': string;
  '--nawasena-hover': string;
  '--nawasena-icon': string;
  '--nawasena-text': string;
};

const nawasenaPillClass =
  'mr-3 inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[var(--nawasena-border)] bg-[var(--nawasena-bg)] px-4 text-sm font-semibold text-[var(--nawasena-text)] backdrop-blur-md transition-colors duration-700 ease-out hover:bg-[var(--nawasena-hover)]';

const getNawasenaPillStyle = (
  isActive: boolean,
  isTransparent: boolean,
): NawasenaPillStyle => ({
  '--nawasena-bg': isTransparent
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(0,0,0,0.08)',
  '--nawasena-border': isActive
    ? '#F8CD24'
    : isTransparent
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(0,0,0,0.10)',
  '--nawasena-hover': isTransparent
    ? 'rgba(255,255,255,0.22)'
    : 'rgba(0,0,0,0.12)',
  '--nawasena-icon': isTransparent ? '#F8CD24' : '#1A3A68',
  '--nawasena-text': isTransparent ? '#ffffff' : '#212529',
});

export const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolledRef = useRef(false);
  const usesTransparentHero =
    location.pathname === '/' ||
    location.pathname === '/umkm' ||
    location.pathname === '/nawasena';
  const isTransparent = usesTransparentHero && !isScrolled;
  const brandTextStyle: CSSProperties | undefined = isTransparent
    ? { textShadow: '0 2px 12px rgba(16,23,8,0.42)' }
    : undefined;

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = isScrolledRef.current
        ? window.scrollY > 2
        : window.scrollY > 12;

      if (nextIsScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-[1000] px-3 py-3 transition-all duration-500 ease-out sm:px-6',
      ].join(' ')}
    >
      <div
        className={[
          'mx-auto flex min-h-[72px] items-center gap-3 rounded-[28px] transition-all duration-500 ease-out',
          isTransparent
            ? 'max-w-7xl translate-y-0 border border-transparent bg-transparent px-5 text-white shadow-none backdrop-blur-0'
            : [
              'max-w-7xl border border-white/70 bg-white/72 px-5 text-[#212529] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl',
              isScrolled ? 'translate-y-2' : 'translate-y-0',
            ].join(' '),
        ].join(' ')}
      >
        <Link
          aria-label="Karang Tengah"
          to="/"
          className={[
            'group inline-flex h-10 shrink-0 items-center rounded-full px-2 text-2xl font-extrabold leading-none tracking-[0.2px] transition-colors duration-500 ease-out sm:text-[26px]',
            isTransparent ? 'text-white' : 'text-[#212529]',
          ].join(' ')}
          style={brandTextStyle}
        >
          Karangtengah
        </Link>

        <nav className="hidden flex-1 items-center justify-end gap-1 lg:flex">
          <NavLink
            className={nawasenaPillClass}
            style={({ isActive }) =>
              getNawasenaPillStyle(isActive, isTransparent)
            }
            to={nawasenaLink.href}
          >
            <nawasenaLink.icon
              className="shrink-0 text-[var(--nawasena-icon)] transition-colors duration-700 ease-out"
              size={16}
              stroke={1.8}
            />
            {nawasenaLink.label}
          </NavLink>

          {navigation.map((item) => (
            <NavLink
              className={() => getNavLinkClass(isScrolled, isTransparent)}
              end={item.href === '/'}
              key={item.href}
              to={item.href}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={getNavIconClass(isActive, isTransparent)}
                    size={17}
                    stroke={1.7}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          className={[
            'ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border transition lg:hidden',
            isTransparent
              ? 'border-white/22 bg-white/8 text-white hover:bg-white/14'
              : 'border-[#EFEFEF] bg-white/80 text-[#212529] hover:bg-[#F8F9FA]',
          ].join(' ')}
          onClick={() => setIsMenuOpen((value) => !value)}
          type="button"
        >
          {isMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="mx-auto mt-3 max-w-7xl px-0 lg:hidden">
          <nav
            className={[
              'grid gap-1 rounded-[24px] border border-white/70 bg-white/86 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl',
              isScrolled ? 'translate-y-2' : 'translate-y-0',
            ].join(' ')}
          >
            <NavLink
              className="flex h-11 items-center gap-3 rounded-full border border-black/10 bg-black/8 px-4 text-sm font-semibold text-[#212529] transition-colors duration-500 ease-out hover:bg-black/12"
              onClick={() => setIsMenuOpen(false)}
              to={nawasenaLink.href}
            >
              <nawasenaLink.icon
                className="text-[#1A3A68]"
                size={18}
                stroke={1.8}
              />
              {nawasenaLink.label}
            </NavLink>

            {navigation.map((item) => (
              <NavLink
                className="flex h-11 items-center gap-3 rounded-full px-4 text-sm font-medium text-[#212529] transition hover:bg-[#72b841]/8"
                end={item.href === '/'}
                key={item.href}
                onClick={() => setIsMenuOpen(false)}
                to={item.href}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={getNavIconClass(isActive, false)}
                      size={18}
                      stroke={1.8}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
};
