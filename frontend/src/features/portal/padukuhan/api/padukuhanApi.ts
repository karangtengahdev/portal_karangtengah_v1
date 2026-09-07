import api from '../../../../api/axios';
import type { PublicPadukuhanResponse } from '../types/padukuhan';

export const fetchPublicPadukuhan = async (): Promise<PublicPadukuhanResponse> => {
  const response = await api.get('/v1/public/padukuhan');
  return response.data;
};
