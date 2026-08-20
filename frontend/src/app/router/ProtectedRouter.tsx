import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../providers/AuthContext';

export const ProtectedRouter = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
