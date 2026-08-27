import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import api, { isApiReady } from '../../../api/axios';
import { useAuth } from '../../../app/providers/AuthContext';
import { getHomePathForRole } from '../../../app/providers/AuthContext';
import { extractAuthTokens } from '../../../app/providers/authStorage';
import { loginUser } from '../api/authApi';

// TIDAK LAGI terima redirectTo -- sekarang SELALU arahkan ke halaman
// utama area sesuai role (Portal/Nawasena) begitu login berhasil,
// bukan "kembali ke halaman asal". Ini sengaja disederhanakan: kalau
// operator sempat dialihkan ke /login karena coba akses area yg BUKAN
// miliknya, tidak masuk akal kirim dia balik ke situ lagi setelah
// login -- lebih aman & jelas langsung ke area miliknya sendiri.
export const useAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@nawasena.id');
  const [password, setPassword] = useState('admin1234');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      let role: string | null = null;

      if (isApiReady) {
        const response = await loginUser(email, password);
        const tokens = extractAuthTokens(response);

        // Simpan token DULU (tanpa role) -- supaya axios interceptor
        // otomatis pasang Authorization header saat kita panggil
        // /auth/me sesaat lagi utk baca role-nya.
        login(tokens.accessToken ?? '', tokens.refreshToken, undefined);

        try {
          const meResponse = await api.get('/v1/auth/me');
          role = meResponse.data?.data?.role ?? null;
        } catch {
          role = null;
        }

        // Simpan ULANG, kali ini sertakan role yg baru didapat.
        login(tokens.accessToken ?? '', tokens.refreshToken, role);
      } else {
        role = 'admin';
        login('dev-access-token', 'dev-refresh-token', role);
      }

      navigate(getHomePathForRole(role), { replace: true });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login gagal. Periksa email, password, atau koneksi API.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMessage,
    handleLogin,
  };
};
