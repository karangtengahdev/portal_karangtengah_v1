import api from '../../../../api/axios';
import type { PublicUmkmResponse, SinglePublicUmkmResponse } from '../types/umkm';

export const fetchPublicUmkm = async (): Promise<PublicUmkmResponse> => {
  const response = await api.get('/v1/public/umkm');
  return response.data;
};

export const fetchPublicUmkmBySlug = async (slug: string): Promise<SinglePublicUmkmResponse> => {
  const response = await api.get(`/v1/public/umkm/${slug}`);
  return response.data;
};
