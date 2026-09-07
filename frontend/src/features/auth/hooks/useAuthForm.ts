import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import api, { isApiReady } from '../../../api/axios';
import { useAuth } from '../../../app/providers/AuthContext';
import { getHomePathForRole } from '../../../app/providers/AuthContext';
import { extractAuthTokens } from '../../../app/providers/authStorage';
import { loginUser } from '../api/authApi';

export const useAuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // KOSONG -- sebelumnya ini diisi default 'admin@nawasena.id' /
  // 'admin1234' utk mempermudah testing, tapi itu artinya kredensial
  // asli nampang di source code (kelihatan via view-source, bahkan
  // sebelum user ketik apa pun). Sekarang sudah ada 3 akun sungguhan
  // (admin/portal/nawasena) dgn password nyata, jadi ini WAJIB kosong.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

        login(tokens.accessToken ?? '', tokens.refreshToken, undefined);

        try {
          const meResponse = await api.get('/v1/auth/me');
          role = meResponse.data?.data?.role ?? null;
        } catch {
          role = null;
        }

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
