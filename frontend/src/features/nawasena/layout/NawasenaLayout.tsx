import { Outlet } from 'react-router-dom';

import { Sidebar } from '../../../shared/components/layout/Sidebar';
import { NawasenaNavbar } from '../components/NawasenaNavbar';

export const NawasenaLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <Sidebar />
      <div className="lg:pl-[220px]">
        <NawasenaNavbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
