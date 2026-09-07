import axios from 'axios';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  clearStoredAuthTokens,
  extractAuthTokens,
  getStoredAuthTokens,
  setStoredAuthTokens,
} from '../app/providers/authStorage';

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _networkRetry?: boolean;
};

const rawApiUrl =
  import.meta.env.VITE_API_URL ?? import.meta.env.VITE_BASEPATH ?? '';
const apiUrl = String(rawApiUrl).trim();

export const isApiReady = Boolean(apiUrl && apiUrl !== 'example');
export const apiBaseURL = isApiReady ? apiUrl : undefined;

export const authLoginEndpoint =
  import.meta.env.VITE_LOGIN_ENDPOINT || '/auth/login';
export const authRefreshEndpoint =
  import.meta.env.VITE_REFRESH_ENDPOINT || '/auth/refresh';

const api = axios.create({
  baseURL: apiBaseURL,
});

const refreshClient = axios.create({
  baseURL: apiBaseURL,
});

let refreshRequest: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const { accessToken } = getStoredAuthTokens();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const refreshAccessToken = async () => {
  const { refreshToken } = getStoredAuthTokens();

  if (!isApiReady || !refreshToken) {
    return null;
  }

  const response = await refreshClient.post(authRefreshEndpoint, {
    refreshToken,
    refresh_token: refreshToken,
  });
  const tokens = extractAuthTokens(response.data);

  setStoredAuthTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken ?? refreshToken,
  });

  return tokens.accessToken;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    // ERR_NETWORK_CHANGED / koneksi putus-nyambung sesaat -- BUKAN
    // error dari server (error.response tidak ada sama sekali).
    // Coba ulang SEKALI setelah jeda singkat sebelum menyerah, supaya
    // gangguan jaringan sesaat tidak langsung bikin halaman gagal load.
    if (!error.response && originalRequest && !originalRequest._networkRetry) {
      originalRequest._networkRetry = true;
      await sleep(800);
      return api(originalRequest);
    }

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshRequest ??= refreshAccessToken().finally(() => {
      refreshRequest = null;
    });

    let nextAccessToken: string | null;

    try {
      nextAccessToken = await refreshRequest;
    } catch {
      clearStoredAuthTokens();
      return Promise.reject(error);
    }

    if (!nextAccessToken) {
      clearStoredAuthTokens();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

    return api(originalRequest);
  },
);

export default api;