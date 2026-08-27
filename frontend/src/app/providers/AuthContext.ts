import { createContext, useContext } from 'react';

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken?: string | null, role?: string | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

// Halaman utama tiap area, dipakai utk redirect setelah login &
// sebagai fallback kalau role tidak dikenali.
export const getHomePathForRole = (role: string | null): string => {
  if (role === 'portal') return '/portal-admin';
  if (role === 'nawasena') return '/nawasena-admin';
  if (role === 'admin') return '/nawasena-admin'; // superadmin: default ke Nawasena
  return '/login';
};
