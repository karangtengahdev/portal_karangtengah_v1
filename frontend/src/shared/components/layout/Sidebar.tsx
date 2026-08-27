import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconBuildingStore,
  IconCalendarEvent,
  IconDots,
  IconLayoutDashboard,
  IconLogout,
  IconMapPin,
  IconNews,
  IconPlant2,
  IconSeeding,
  IconX,
} from '@tabler/icons-react';

import { useAuth } from '../../../app/providers/AuthContext';

interface NavItemConfig {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

// Dua set menu TERPISAH TOTAL -- Portal (pemuda: konten publik) dan
// Nawasena (tim teknologi: data pertanian/IoT). Yang tampil dipilih
// berdasarkan role akun yang login, lihat getNavForRole() di bawah.
const PORTAL_NAV: NavItemConfig[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard, path: '/portal-admin' },
  { label: 'Berita', icon: IconNews, path: '/portal-admin/berita' },
  { label: 'UMKM', icon: IconBuildingStore, path: '/portal-admin/umkm' },
  { label: 'Profil Desa', icon: IconMapPin, path: '/portal-admin/village' },
];

const NAWASENA_NAV: NavItemConfig[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard, path: '/nawasena-admin' },
  { label: 'Data Panen', icon: IconPlant2, path: '/nawasena-admin/harvest' },
  { label: 'Jadwal Tanam', icon: IconSeeding, path: '/nawasena-admin/planting-schedule' },
  { label: 'Jadwal', icon: IconCalendarEvent, path: '/nawasena-admin/schedule' },
];

const getNavForRole = (role: string | null): NavItemConfig[] => {
  if (role === 'portal') return PORTAL_NAV;
  // 'nawasena' dan superadmin ('admin') pakai menu Nawasena sbg default
  return NAWASENA_NAV;
};

const getBrandLabel = (role: string | null): string => {
  if (role === 'portal') return 'PORTAL DESA';
  return 'NAWASENA';
};

// ── Desktop nav item ──────────────────────────────────────────────
const DesktopNavItem = ({ label, icon: Icon, path, badge }: NavItemConfig) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active =
    path.endsWith('-admin')
      ? location.pathname === path
      : location.pathname.startsWith(path);

  return (
    <button
      onClick={() => navigate(path)}
      className={[
        'flex w-full items-center gap-2.5 rounded-[7px] px-2.5 py-[9px] text-[13px] transition',
        active
          ? 'bg-[rgba(114,184,65,0.18)] font-medium text-white'
          : 'font-normal text-white/75 hover:bg-white/8 hover:text-white',
      ].join(' ')}
    >
      <Icon
        size={16}
        stroke={1.6}
        className={active ? 'text-[#72b841]' : 'text-white/55'}
      />
      <span className="flex-1 text-left">{label}</span>
      {badge ? (
        <span className="rounded-full bg-[rgba(114,184,65,0.25)] px-1.5 py-0.5 text-[10px] font-semibold text-[#a5d876]">
          {badge}
        </span>
      ) : null}
    </button>
  );
};

// ── Mobile bottom nav item ────────────────────────────────────────
const MobileNavItem = ({ label, icon: Icon, path }: NavItemConfig) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active = path.endsWith('-admin')
    ? location.pathname === path
    : location.pathname.startsWith(path);

  return (
    <button
      onClick={() => navigate(path)}
      className={[
        'flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium transition',
        active
          ? 'bg-[rgba(114,184,65,0.2)] text-[#c6e99b]'
          : 'text-white/65 hover:bg-white/8 hover:text-white',
      ].join(' ')}
    >
      <Icon size={19} stroke={1.5} />
      {label}
    </button>
  );
};

// ── Main export ───────────────────────────────────────────────────
export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const navItems = getNavForRole(role);
  const brandLabel = getBrandLabel(role);
  const roleLabel = role === 'portal' ? 'Admin Portal' : 'Tim Teknologi';

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col bg-[#0D3D1F] lg:flex">
        <div className="border-b border-white/10 px-[18px] py-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#72b841]">
            {brandLabel}
          </p>
          <h2 className="mt-1 text-[15px] font-semibold leading-tight text-white">
            KARANGTENGAH
          </h2>
        </div>

        <div className="mt-4 px-2.5">
          <p className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Menu
          </p>
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => <DesktopNavItem key={item.path} {...item} />)}
          </nav>
        </div>

        {/* Footer user */}
        <div className="mt-auto border-t border-white/10 px-2.5 py-3">
          <div className="flex cursor-default items-center gap-2.5 rounded-[7px] px-2.5 py-1.5 hover:bg-white/6">
            <div className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-[rgba(114,184,65,0.22)] text-[11px] font-semibold text-[#72b841]">
              {role === 'portal' ? 'AP' : 'TT'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[12.5px] font-medium text-white">{roleLabel}</p>
              <p className="text-[10px] text-white/50">{role === 'admin' ? 'Superadmin' : 'Pengelola'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-[7px] px-2.5 py-2 text-[12.5px] font-medium text-red-300/70 transition hover:bg-red-500/8 hover:text-red-300"
          >
            <IconLogout size={15} stroke={1.5} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ============ TABLET — horizontal scrollable nav ============ */}
      <nav className="hidden overflow-x-auto border-b border-neutral-200 bg-white px-4 py-2 md:flex lg:hidden">
        {navItems.map(({ label, icon: Icon, path }) => {
          const location = window.location.pathname;
          const active = path.endsWith('-admin')
            ? location === path
            : location.startsWith(path);

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={[
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-medium transition',
                active
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800',
              ].join(' ')}
            >
              <Icon size={15} stroke={1.5} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0D3D1F] md:hidden">
        <div className="flex items-stretch gap-0.5 px-1.5 py-1.5">
          {navItems.map((item) => (
            <MobileNavItem key={item.path} {...item} />
          ))}

          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium text-white/65 transition hover:bg-white/8 hover:text-white"
          >
            <IconDots size={19} stroke={1.5} />
            Akun
          </button>
        </div>
        <div className="pb-safe" />
      </nav>

      {/* ============ BOTTOM SHEET "Akun" (profil + logout) ============ */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSheetOpen(false)}
          />

          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-[#0D3D1F] md:hidden">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-[13px] font-semibold text-white">Akun</p>
              <button
                onClick={() => setSheetOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/15"
              >
                <IconX size={15} stroke={2} />
              </button>
            </div>

            <div className="border-t border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[rgba(114,184,65,0.22)] text-[12px] font-semibold text-[#72b841]">
                {role === 'portal' ? 'AP' : 'TT'}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">{roleLabel}</p>
                <p className="text-[11px] text-white/50">{brandLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-red-400/25 px-3 py-1.5 text-[12px] font-medium text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <IconLogout size={14} stroke={1.5} />
                Keluar
              </button>
            </div>

            <div className="pb-safe" />
          </div>
        </>
      )}
    </>
  );
};
