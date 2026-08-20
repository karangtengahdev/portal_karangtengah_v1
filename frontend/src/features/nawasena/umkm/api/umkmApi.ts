import api from '../../../../api/axios';
import type { UmkmPayload, UmkmResponse, SingleUmkmResponse } from '../types/umkm';

export const fetchAdminUmkm = async (): Promise<UmkmResponse> => {
  const response = await api.get('/v1/cms/umkm');
  return response.data;
};

export const createAdminUmkm = async (payload: UmkmPayload): Promise<SingleUmkmResponse> => {
  const response = await api.post('/v1/cms/umkm', payload);
  return response.data;
};

export const updateAdminUmkm = async (id: string, payload: UmkmPayload): Promise<SingleUmkmResponse> => {
  const response = await api.put(`/v1/cms/umkm/${id}`, payload);
  return response.data;
};

export const deleteAdminUmkm = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/umkm/${id}`);
  return response.data;
};

export const uploadUmkmCover = async (id: string, file: File): Promise<SingleUmkmResponse> => {
  const formData = new FormData();
  formData.append('file', file); 
  const response = await api.post(`/v1/cms/umkm/${id}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const publishAdminUmkm = async (id: string): Promise<SingleUmkmResponse> => {
  const response = await api.patch(`/v1/cms/umkm/${id}/publish`);
  return response.data;
};