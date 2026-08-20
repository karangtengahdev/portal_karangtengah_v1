import { Outlet, useLocation, ScrollRestoration  } from 'react-router-dom';
import { Navbar } from './Navbar';
import { NawasenaFloatingAccess } from './NawasenaFloatingAccess';
import { PortalFooter } from './PortalFooter';

export const DashboardLayout = () => {
  const location = useLocation();
  const isFlushTopPage =
    location.pathname === '/' ||
    location.pathname === '/umkm' ||
    location.pathname === '/nawasena';

  return (
    <div className="min-h-screen bg-white text-[#212529]">
      <Navbar />
      <ScrollRestoration />
      <main className={isFlushTopPage ? undefined : 'pt-20 sm:pt-24'}>
        <Outlet />
      </main>
      <PortalFooter className="mt-8" />
      <NawasenaFloatingAccess />
    </div>
  );
};
