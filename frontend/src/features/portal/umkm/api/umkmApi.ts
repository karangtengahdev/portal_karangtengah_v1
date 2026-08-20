import api from '../../../../api/axios'; 
import type { PublicUmkmResponse } from '../types/umkm';

export const fetchPublicUmkm = async (): Promise<PublicUmkmResponse> => {
  const response = await api.get('/v1/public/umkm');
  return response.data;
};