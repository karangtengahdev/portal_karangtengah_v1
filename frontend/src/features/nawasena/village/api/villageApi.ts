import api from '../../../../api/axios';
import type { GalleryPayload, VillagePayload, VillageResponse } from '../types/village';

//public
export const fetchVillageProfile = async (): Promise<VillageResponse> => {
  const response = await api.get('/v1/public/village');
  return response.data;
};

export const updateVillageProfile = async (payload: VillagePayload): Promise<{ success: boolean }> => {
  const response = await api.put('/v1/cms/village', payload);
  return response.data;
};

export const uploadGalleryImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file); // Sesuaikan 'file' atau 'image' dengan backend
  const response = await api.post('/v1/cms/village/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const addGalleryItem = async (payload: GalleryPayload): Promise<{ success: boolean }> => {
  const response = await api.post('/v1/cms/village/gallery', payload);
  return response.data;
};

export const deleteGalleryItem = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/village/gallery/${id}`);
  return response.data;
};