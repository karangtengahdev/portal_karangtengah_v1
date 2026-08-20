import api from '../../../../api/axios';
import type { SchedulePayload, ScheduleResponse, SingleScheduleResponse } from '../types/schedule';

export const fetchAdminSchedule = async (): Promise<ScheduleResponse> => {
  const response = await api.get('/v1/cms/schedule');
  return response.data;
};

export const createAdminSchedule = async (payload: SchedulePayload): Promise<SingleScheduleResponse> => {
  const response = await api.post('/v1/cms/schedule', payload);
  return response.data;
};

export const updateAdminSchedule = async (id: string, payload: SchedulePayload): Promise<SingleScheduleResponse> => {
  const response = await api.put(`/v1/cms/schedule/${id}`, payload);
  return response.data;
};

export const deleteAdminSchedule = async (id: string): Promise<{ success: boolean }> => {
  const response = await api.delete(`/v1/cms/schedule/${id}`);
  return response.data;
};