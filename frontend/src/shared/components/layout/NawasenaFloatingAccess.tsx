import { Link, useLocation } from 'react-router-dom';
import { IconLayoutDashboard, IconLogin2 } from '@tabler/icons-react';

import { useAuth } from '../../../app/providers/AuthContext';

export const NawasenaFloatingAccess = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const label = isAuthenticated ? 'Buka Dashboard' : 'Masuk Pengelola';

  if (location.pathname !== '/nawasena') {
    return null;
  }

  return (
    <Link
      aria-label={label}
      className="group fixed bottom-5 right-5 z-[1001] grid h-14 w-14 place-items-center rounded-full bg-[#070907] shadow-[0_16px_36px_rgba(16,23,8,0.36)] ring-8 ring-[#070907]/10 transition hover:-translate-y-0.5 hover:bg-[#12170f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd62e] sm:bottom-6 sm:right-6"
      state={isAuthenticated ? undefined : { from: { pathname: '/dashboard' } }}
      to={isAuthenticated ? '/dashboard' : '/login'}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[#ffd62e]/30"
      />
      <span className="absolute -left-3 top-1/2 hidden -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-full bg-[#101708] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-[0_10px_24px_rgba(16,23,8,0.22)] transition group-hover:opacity-100 sm:block">
        {label}
      </span>
      <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-[#ffd62e] text-[#070907] shadow-[0_0_16px_rgba(255,214,46,0.46)]">
        {isAuthenticated ? (
          <IconLayoutDashboard size={21} stroke={2.45} />
        ) : (
          <IconLogin2 size={21} stroke={2.45} />
        )}
      </span>
    </Link>
  );
};
