import { Outlet } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';

// Dulu bernama NawasenaLayout, tinggal di features/nawasena/layout/.
// Dipindah ke sini karena KENYATAANNYA dipakai BERDUA -- baik area
// /portal-admin maupun /nawasena-admin (lihat router.tsx) -- jadi ini
// infrastruktur bersama, bukan milik satu area saja.
export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <Sidebar />
      <div className="lg:pl-[220px]">
        <AdminNavbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
