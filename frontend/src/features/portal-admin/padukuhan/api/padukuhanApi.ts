import api from '../../../../api/axios';
import type { PadukuhanResponse, SinglePadukuhanResponse, PadukuhanPayload } from '../types/padukuhan';

export const fetchAdminPadukuhan = async (): Promise<PadukuhanResponse> => {
  const response = await api.get('/v1/cms/padukuhan');
  return response.data;
};

export const createAdminPadukuhan = async (payload: PadukuhanPayload): Promise<SinglePadukuhanResponse> => {
  const response = await api.post('/v1/cms/padukuhan', payload);
  return response.data;
};

export const updateAdminPadukuhan = async (
  id: string,
  payload: PadukuhanPayload,
): Promise<SinglePadukuhanResponse> => {
  const response = await api.put(`/v1/cms/padukuhan/${id}`, payload);
  return response.data;
};

export const deleteAdminPadukuhan = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/padukuhan/${id}`);
  return response.data;
};

export const uploadPadukuhanGallery = async (
  id: string,
  file: File,
  caption?: string,
): Promise<SinglePadukuhanResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  if (caption) formData.append('caption', caption);
  const response = await api.post(`/v1/cms/padukuhan/${id}/gallery/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deletePadukuhanGallery = async (galleryId: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/padukuhan/gallery/${galleryId}`);
  return response.data;
};
