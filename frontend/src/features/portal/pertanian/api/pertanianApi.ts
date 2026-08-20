import api from '../../../../api/axios';
import type { PublicHarvestResponse, PublicHarvestStatsResponse } from '../types/pertanian';

export const fetchPublicHarvest = async (): Promise<PublicHarvestResponse> => {
  const response = await api.get('/v1/public/harvest');
  return response.data;
};

export const fetchPublicHarvestStats = async (): Promise<PublicHarvestStatsResponse> => {
  const response = await api.get('/v1/public/harvest/stats');
  return response.data;
};