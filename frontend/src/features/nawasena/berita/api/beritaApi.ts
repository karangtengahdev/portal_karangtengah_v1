import api from '../../../../api/axios';
import type { BeritaPayload, BeritaResponse, SingleBeritaResponse } from '../types/berita';

// Ambil semua berita (termasuk draft) untuk dashboard admin.
export const fetchAdminBerita = async (): Promise<BeritaResponse> => {
  const response = await api.get('/v1/cms/news');
  return response.data;
};

// Buat berita baru. Cover diupload TERPISAH setelah dapat id (lihat hook).
export const createAdminBerita = async (payload: BeritaPayload): Promise<SingleBeritaResponse> => {
  const response = await api.post('/v1/cms/news', payload);
  return response.data;
};

export const updateAdminBerita = async (
  id: string,
  payload: BeritaPayload,
): Promise<SingleBeritaResponse> => {
  const response = await api.put(`/v1/cms/news/${id}`, payload);
  return response.data;
};

export const deleteAdminBerita = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/news/${id}`);
  return response.data;
};

// Upload gambar cover — multipart, endpoint terpisah. Pola sama seperti UMKM.
export const uploadBeritaCover = async (id: string, file: File): Promise<SingleBeritaResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/v1/cms/news/${id}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Toggle publish/draft (PATCH), sama seperti UMKM.
export const publishAdminBerita = async (id: string): Promise<SingleBeritaResponse> => {
  const response = await api.patch(`/v1/cms/news/${id}/publish`);
  return response.data;
};
