import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AuthContext } from './AuthContext';
import {
  clearStoredAuthTokens,
  getStoredAuthTokens,
  getStoredUserRole,
  setStoredAuthTokens,
  setStoredUserRole,
  subscribeAuthStorage,
} from './authStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState(() => getStoredAuthTokens());
  const [role, setRole] = useState<string | null>(() => getStoredUserRole());

  const login = (
    newAccessToken: string,
    newRefreshToken?: string | null,
    newRole?: string | null,
  ) => {
    setStoredAuthTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken ?? null,
    });
    if (newRole !== undefined) {
      setStoredUserRole(newRole);
      setRole(newRole);
    }
  };

  const logout = () => {
    clearStoredAuthTokens();
    setRole(null);
  };

  useEffect(
    () =>
      subscribeAuthStorage((updated) => {
        setTokens(updated);
        setRole(getStoredUserRole());
      }),
    [],
  );

  const value = useMemo(
    () => ({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      role,
      isAuthenticated: Boolean(tokens.accessToken),
      login,
      logout,
    }),
    [tokens, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
