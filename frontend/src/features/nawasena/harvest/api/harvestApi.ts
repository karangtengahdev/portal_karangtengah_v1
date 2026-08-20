import api from '../../../../api/axios';
import type { HarvestPayload, HarvestResponse, SingleHarvestResponse } from '../types/harvest';

export const fetchAdminHarvest = async (): Promise<HarvestResponse> => {
  const response = await api.get('/v1/cms/harvest');
  return response.data;
};

export const createAdminHarvest = async (payload: HarvestPayload): Promise<SingleHarvestResponse> => {
  const response = await api.post('/v1/cms/harvest', payload);
  return response.data;
};

export const updateAdminHarvest = async (id: string, payload: HarvestPayload): Promise<SingleHarvestResponse> => {
  const response = await api.put(`/v1/cms/harvest/${id}`, payload);
  return response.data;
};

export const deleteAdminHarvest = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/harvest/${id}`);
  return response.data;
};