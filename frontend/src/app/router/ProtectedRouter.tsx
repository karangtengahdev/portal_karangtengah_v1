import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { getHomePathForRole, useAuth } from '../providers/AuthContext';

type ProtectedRouterProps = {
  // Kalau diisi, hanya role di dalam array ini (atau 'admin' sbg
  // superadmin) yang boleh masuk. Kalau kosong/tidak diisi, cuma cek
  // login saja (dipakai kalau suatu saat ada halaman yg boleh diakses
  // role manapun asal sudah login).
  allowedRoles?: string[];
};

export const ProtectedRouter = ({ allowedRoles }: ProtectedRouterProps) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isSuperadmin = role === 'admin';
    const roleAllowed = role ? allowedRoles.includes(role) : false;

    // Sudah login tapi role-nya bukan pemilik area ini -- JANGAN
    // lempar ke /login lagi (dia toh sudah login), arahkan ke halaman
    // utama AREA MILIKNYA sendiri.
    if (!isSuperadmin && !roleAllowed) {
      return <Navigate to={getHomePathForRole(role)} replace />;
    }
  }

  return <Outlet />;
};
