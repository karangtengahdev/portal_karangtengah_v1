import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AuthContext } from './AuthContext';
import {
  clearStoredAuthTokens,
  getStoredAuthTokens,
  setStoredAuthTokens,
  subscribeAuthStorage,
} from './authStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState(() => getStoredAuthTokens());

  const login = (newAccessToken: string, newRefreshToken?: string | null) => {
    setStoredAuthTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken ?? null,
    });
  };

  const logout = () => {
    clearStoredAuthTokens();
  };

  useEffect(() => subscribeAuthStorage(setTokens), []);

  const value = useMemo(
    () => ({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      isAuthenticated: Boolean(tokens.accessToken),
      login,
      logout,
    }),
    [tokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
