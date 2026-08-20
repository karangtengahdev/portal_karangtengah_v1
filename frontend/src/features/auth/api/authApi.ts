import api from '../../../api/axios';
import type { LoginResponse } from '../types/auth';

export const loginUser = async (
  email: string, // Diubah dari username
  password: string,
): Promise<LoginResponse> => {
  // Axios otomatis mengubah object ini menjadi JSON body
  const response = await api.post('/v1/auth/login', { email, password });

  return response.data;
};