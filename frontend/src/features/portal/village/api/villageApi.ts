import api from '../../../../api/axios';
import type { PublicVillageResponse } from '../types/village';

export const fetchPublicVillage = async (): Promise<PublicVillageResponse> => {
  const response = await api.get('/v1/public/village');
  return response.data;
};
