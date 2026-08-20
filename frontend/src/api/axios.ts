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

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

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


// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASEPATH,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;