import api from '../../../../api/axios';
import type { ListMusimTanamResponse, SingleMusimTanamResponse, ListKomoditasResponse } from '../types/plantingSchedule';

export const fetchPublicJadwalTanam = async (
  komoditasId?: string,
  status?: string,
): Promise<ListMusimTanamResponse> => {
  const params: Record<string, string> = {};
  if (komoditasId) params.komoditasId = komoditasId;
  if (status) params.status = status;
  const response = await api.get('/v1/public/planting-schedule', { params });
  return response.data;
};

export const fetchPublicDetailJadwalTanam = async (
  id: string,
): Promise<SingleMusimTanamResponse> => {
  const response = await api.get(`/v1/public/planting-schedule/${id}`);
  return response.data;
};

export const fetchPublicKomoditas = async (): Promise<ListKomoditasResponse> => {
  const response = await api.get('/v1/public/planting-schedule/komoditas');
  return response.data;
};
