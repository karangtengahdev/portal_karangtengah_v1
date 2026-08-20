export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

const AUTH_STORAGE_EVENT = 'auth-storage-change';

export const getStoredAuthTokens = (): AuthTokens => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
});

export const setStoredAuthTokens = ({
  accessToken,
  refreshToken,
}: AuthTokens) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  window.dispatchEvent(
    new CustomEvent<AuthTokens>(AUTH_STORAGE_EVENT, {
      detail: getStoredAuthTokens(),
    }),
  );
};

export const clearStoredAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  window.dispatchEvent(
    new CustomEvent<AuthTokens>(AUTH_STORAGE_EVENT, {
      detail: {
        accessToken: null,
        refreshToken: null,
      },
    }),
  );
};

export const subscribeAuthStorage = (listener: (tokens: AuthTokens) => void) => {
  const handleAuthChange = (event: Event) => {
    listener((event as CustomEvent<AuthTokens>).detail);
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === ACCESS_TOKEN_KEY ||
      event.key === REFRESH_TOKEN_KEY ||
      event.key === null
    ) {
      listener(getStoredAuthTokens());
    }
  };

  window.addEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener(AUTH_STORAGE_EVENT, handleAuthChange);
    window.removeEventListener('storage', handleStorageChange);
  };
};

const tokenCandidates = (payload: unknown): Array<Record<string, unknown>> => {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload as Record<string, unknown>;
  const nestedData =
    data.data && typeof data.data === 'object'
      ? (data.data as Record<string, unknown>)
      : null;
  const tokens =
    data.tokens && typeof data.tokens === 'object'
      ? (data.tokens as Record<string, unknown>)
      : null;
  const nestedTokens =
    nestedData?.tokens && typeof nestedData.tokens === 'object'
      ? (nestedData.tokens as Record<string, unknown>)
      : null;

  return [data, nestedData, tokens, nestedTokens].filter(Boolean) as Array<
    Record<string, unknown>
  >;
};

export const extractAuthTokens = (payload: unknown): AuthTokens => {
  for (const candidate of tokenCandidates(payload)) {
    const accessToken =
      candidate.accessToken ??
      candidate.access_token ??
      candidate.token ??
      candidate.access;
    const refreshToken =
      candidate.refreshToken ?? candidate.refresh_token ?? candidate.refresh;

    if (typeof accessToken === 'string' && accessToken.length > 0) {
      return {
        accessToken,
        refreshToken:
          typeof refreshToken === 'string' && refreshToken.length > 0
            ? refreshToken
            : null,
      };
    }
  }

  throw new Error('Response auth belum mengembalikan access token.');
};
