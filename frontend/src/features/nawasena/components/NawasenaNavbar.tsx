// import { useNavigate } from 'react-router-dom';
import { IconBell, IconSearch } from '@tabler/icons-react';

// import { useAuth } from '../../../app/providers/AuthContext';

export const NawasenaNavbar = () => {
  // const navigate = useNavigate();
  // const { logout } = useAuth();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login', { replace: true });
  // };

  return (
    <header className="sticky top-0 z-20 h-13 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb — hanya di desktop */}
        <nav className="hidden flex-1 items-center gap-2 text-[12.5px] text-neutral-400 lg:flex">
          <span>Panellll</span>
          <span className="text-neutral-300">/</span>
          <span className="font-medium text-neutral-900">Dashboardddddd</span>
        </nav>

        {/* Logo ringkas untuk mobile (sidebar tidak tampil) */}
        <div className="flex flex-1 items-center gap-2 lg:hidden">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Nawasena
          </span>
          <span className="text-neutral-200">/</span>
          <span className="text-sm font-medium text-neutral-900">Dashboard</span>
        </div>

        {/* Kanan */}
        <div className="flex items-center gap-2">
          {/* Search pill — hanya desktop */}
          <div className="hidden cursor-text items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] text-neutral-400 sm:flex">
            <IconSearch size={13} />
            Cari data…
          </div>

          {/* Status sistem */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[#C0DD97] bg-[#EAF3DE] px-2.5 py-1 text-[11px] font-medium text-[#3B6D11] sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#639922]" />
            Sistem aktif
          </div>

          {/* Notifikasi */}
          <button
            aria-label="Notifikasi"
            className="relative grid h-8 w-8 place-items-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 transition hover:border-neutral-300 hover:bg-white"
            type="button"
          >
            <IconBell size={16} />
            {/* dot notifikasi */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};