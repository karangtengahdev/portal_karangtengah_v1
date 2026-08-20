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

const MAIN_NAV: NavItemConfig[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard, path: '/dashboard' },
  { label: 'Data Panen', icon: IconPlant2, path: '/dashboard/harvest' },
  { label: 'Jadwal Tanam', icon: IconSeeding, path: '/dashboard/planting-schedule' },
  { label: 'Berita', icon: IconNews, path: '/dashboard/berita' },
  { label: 'Jadwal', icon: IconCalendarEvent, path: '/dashboard/schedule' },
];

const MANAGE_NAV: NavItemConfig[] = [
  { label: 'UMKM', icon: IconBuildingStore, path: '/dashboard/umkm' },
  { label: 'Profil Desa', icon: IconMapPin, path: '/dashboard/village' },
];

// 4 menu utama yang tampil di bottom bar
const MOBILE_BOTTOM_NAV: NavItemConfig[] = [
  { label: 'Ringkasan', icon: IconLayoutDashboard, path: '/dashboard' },
  { label: 'Panen', icon: IconPlant2, path: '/dashboard/harvest' },
  { label: 'Berita', icon: IconNews, path: '/dashboard/berita' },
  { label: 'UMKM', icon: IconBuildingStore, path: '/dashboard/umkm' },
];

// Menu yang tersembunyi di bottom sheet "Lainnya"
const MORE_NAV: NavItemConfig[] = [
  { label: 'Jadwal Tanam', icon: IconSeeding, path: '/dashboard/planting-schedule' },
  { label: 'Jadwal', icon: IconCalendarEvent, path: '/dashboard/schedule' },
  { label: 'Profil Desa', icon: IconMapPin, path: '/dashboard/village' },
];

// ── Desktop nav item ──────────────────────────────────────────────
const DesktopNavItem = ({ label, icon: Icon, path, badge }: NavItemConfig) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active =
    path === '/dashboard'
      ? location.pathname === '/dashboard'
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
const MobileNavItem = ({
  label,
  icon: Icon,
  path,
  onClick,
}: NavItemConfig & { onClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const active =
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <button
      onClick={() => {
        onClick?.();
        navigate(path);
      }}
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
  const location = useLocation();
  const { logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col bg-[#0D3D1F] lg:flex">
        {/* Brand */}
        <div className="border-b border-white/10 px-[18px] py-5">
          {/* <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#72b841]">
            Nawasena CMS
          </p> */}
          <h2 className="mt-1 text-[15px] font-semibold leading-tight text-white">
            KARANGTENGAH
          </h2>
          {/* <p className="mt-0.5 text-[10px] text-white/50">Panel Admin · Smart Farming</p> */}
        </div>

        {/* Nav utama */}
        <div className="mt-4 px-2.5">
          <p className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Utama
          </p>
          <nav className="flex flex-col gap-0.5">
            {MAIN_NAV.map((item) => <DesktopNavItem key={item.path} {...item} />)}
          </nav>
        </div>

        {/* Nav pengelolaan */}
        <div className="mt-4 px-2.5">
          <p className="mb-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Pengelolaan
          </p>
          <nav className="flex flex-col gap-0.5">
            {MANAGE_NAV.map((item) => <DesktopNavItem key={item.path} {...item} />)}
          </nav>
        </div>

        {/* Footer user */}
        <div className="mt-auto border-t border-white/10 px-2.5 py-3">
          <div className="flex cursor-default items-center gap-2.5 rounded-[7px] px-2.5 py-1.5 hover:bg-white/6">
            <div className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-[rgba(114,184,65,0.22)] text-[11px] font-semibold text-[#72b841]">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[12.5px] font-medium text-white">Admin Desa</p>
              <p className="text-[10px] text-white/50">Pengelola</p>
            </div>
            <IconDots size={14} className="text-white/35" />
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
        {[...MAIN_NAV, ...MANAGE_NAV].map(({ label, icon: Icon, path }) => {
          const active =
            path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(path);

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
          {MOBILE_BOTTOM_NAV.map((item) => (
            <MobileNavItem key={item.path} {...item} />
          ))}

          {/* Tombol Lainnya — membuka bottom sheet */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium text-white/65 transition hover:bg-white/8 hover:text-white"
          >
            <IconDots size={19} stroke={1.5} />
            Lainnya
          </button>
        </div>
        {/* Safe area iPhone */}
        <div className="pb-safe" />
      </nav>

      {/* ============ BOTTOM SHEET "Lainnya" ============ */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-[#0D3D1F] md:hidden">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {/* Header sheet */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="text-[13px] font-semibold text-white">Menu lainnya</p>
              <button
                onClick={() => setSheetOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/15"
              >
                <IconX size={15} stroke={2} />
              </button>
            </div>

            {/* Menu items di sheet */}
            <div className="px-4 py-3 flex flex-col gap-1">
              {MORE_NAV.map(({ label, icon: Icon, path }) => {
                const active = location.pathname.startsWith(path);
                return (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setSheetOpen(false);
                    }}
                    className={[
                      'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14px] font-medium transition',
                      active
                        ? 'bg-[rgba(114,184,65,0.18)] text-white'
                        : 'text-white/80 hover:bg-white/8 hover:text-white',
                    ].join(' ')}
                  >
                    <Icon size={20} stroke={1.5} className={active ? 'text-[#72b841]' : 'text-white/50'} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* User info + logout di sheet */}
            <div className="border-t border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[rgba(114,184,65,0.22)] text-[12px] font-semibold text-[#72b841]">
                AD
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">Admin Desa</p>
                <p className="text-[11px] text-white/50">Pengelola</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-red-400/25 px-3 py-1.5 text-[12px] font-medium text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <IconLogout size={14} stroke={1.5} />
                Keluar
              </button>
            </div>

            {/* Safe area iPhone */}
            <div className="pb-safe" />
          </div>
        </>
      )}
    </>
  );
};