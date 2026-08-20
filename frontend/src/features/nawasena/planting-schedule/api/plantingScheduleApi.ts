import api from '../../../../api/axios';
import type {
  ListMusimTanamResponse,
  SingleMusimTanamResponse,
  ListKomoditasResponse,
  CreateMusimTanamPayload,
  CreateTahapanPayload,
  Komoditas,
} from '../types/plantingSchedule';

export const fetchAdminMusimTanam = async (params?: { status?: string; komoditasId?: string }) => {
  const response = await api.get<ListMusimTanamResponse>('/v1/cms/planting-schedule', { params });
  return response.data;
};

export const fetchAdminMusimTanamDetail = async (id: string) => {
  const response = await api.get<SingleMusimTanamResponse>(`/v1/cms/planting-schedule/${id}`);
  return response.data;
};

export const createAdminMusimTanam = async (payload: CreateMusimTanamPayload) => {
  const response = await api.post<{ success: boolean; data: any }>('/v1/cms/planting-schedule', payload);
  return response.data;
};

export const updateAdminMusimTanam = async (id: string, payload: Partial<CreateMusimTanamPayload>) => {
  const response = await api.put<{ success: boolean; data: any }>(`/v1/cms/planting-schedule/${id}`, payload);
  return response.data;
};

export const deleteAdminMusimTanam = async (id: string) => {
  const response = await api.delete<{ success: boolean; data: any }>(`/v1/cms/planting-schedule/${id}`);
  return response.data;
};

export const createTahapan = async (musimTanamId: string, payload: CreateTahapanPayload) => {
  const response = await api.post<{ success: boolean; data: any }>(`/v1/cms/planting-schedule/${musimTanamId}/tahapan`, payload);
  return response.data;
};

export const updateTahapan = async (id: string, payload: Partial<CreateTahapanPayload>) => {
  const response = await api.put<{ success: boolean; data: any }>(`/v1/cms/planting-schedule/tahapan/${id}`, payload);
  return response.data;
};

export const deleteTahapan = async (id: string) => {
  const response = await api.delete<{ success: boolean; data: any }>(`/v1/cms/planting-schedule/tahapan/${id}`);
  return response.data;
};

export const fetchKomoditas = async () => {
  const response = await api.get<ListKomoditasResponse>('/v1/public/planting-schedule/komoditas');
  return response.data;
};

export const createKomoditas = async (payload: { nama: string; deskripsi?: string }) => {
  const response = await api.post<{ success: boolean; data: Komoditas }>('/v1/cms/planting-schedule/komoditas', payload);
  return response.data;
};
