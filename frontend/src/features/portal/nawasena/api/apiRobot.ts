import api from '../../../../api/axios';
import type { RoverTrackResponse } from '../types/robot';

export const getRoverTrack = async (deviceId: string): Promise<RoverTrackResponse> => {
  const response = await api.get<RoverTrackResponse>(`/v1/public/rover/${deviceId}/track`);
  return response.data;
};