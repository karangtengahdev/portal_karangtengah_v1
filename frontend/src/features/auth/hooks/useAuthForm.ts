import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { isApiReady } from '../../../api/axios';
import { useAuth } from '../../../app/providers/AuthContext';
import { extractAuthTokens } from '../../../app/providers/authStorage';
import { loginUser } from '../api/authApi';

export const useAuthForm = (redirectTo = '/dashboard') => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Menggunakan default email & password untuk mempermudah testing
  const [email, setEmail] = useState('admin@nawasena.id'); 
  const [password, setPassword] = useState('admin1234');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isApiReady) {
        const response = await loginUser(email, password); // Gunakan email di sini
        const tokens = extractAuthTokens(response);
        login(tokens.accessToken ?? '', tokens.refreshToken);
      } else {
        login('dev-access-token', 'dev-refresh-token');
      }

      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      // Menangkap pesan error dari backend jika ada
      const message = error.response?.data?.message || 'Login gagal. Periksa email, password, atau koneksi API.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email, // Return email
    setEmail,
    password,
    setPassword,
    isSubmitting,
    errorMessage,
    handleLogin,
  };
};