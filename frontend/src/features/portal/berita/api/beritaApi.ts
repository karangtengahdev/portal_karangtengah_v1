import api from '../../../../api/axios'; 
import type { PublicBeritaResponse, SinglePublicBeritaResponse } from '../types/berita';

export const fetchPublicBerita = async (): Promise<PublicBeritaResponse> => {
  const response = await api.get('/v1/public/news');
  return response.data;
};

export const fetchPublicBeritaBySlug = async (slug: string): Promise<SinglePublicBeritaResponse> => {
  const response = await api.get(`/v1/public/news/${slug}`);
  return response.data;
};