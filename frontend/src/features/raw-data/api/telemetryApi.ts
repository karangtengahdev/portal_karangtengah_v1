import api from '../../../api/axios';
import type { RawTelemetryResponse } from '../types/telemetry';

export const fetchRawTelemetry = async (
  deviceId?: string,
  limit = 50,
): Promise<RawTelemetryResponse> => {
  const params: Record<string, string> = { limit: String(limit) };
  if (deviceId) params.deviceId = deviceId;
  const response = await api.get('/v1/public/telemetry/recent', { params });
  return response.data;
};
