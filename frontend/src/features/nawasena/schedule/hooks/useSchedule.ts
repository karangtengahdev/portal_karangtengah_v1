import { useCallback, useEffect, useState } from 'react';
import { 
  fetchAdminSchedule, 
  createAdminSchedule, 
  updateAdminSchedule, 
  deleteAdminSchedule 
} from '../api/scheduleApi';
import type { ScheduleItem, SchedulePayload } from '../types/schedule';

export const useAdminSchedule = () => {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAdminSchedule();
      if (response.success) {
        setData(response.data); // data adalah array langsung
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data jadwal pertanian.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  const handleCreate = async (payload: SchedulePayload) => {
    try {
      setIsMutating(true);
      await createAdminSchedule(payload);
      await getSchedule();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal membuat jadwal baru.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, payload: SchedulePayload) => {
    try {
      setIsMutating(true);
      await updateAdminSchedule(id, payload);
      await getSchedule();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal memperbarui jadwal.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus jadwal pertanian ini?')) return;
    try {
      await deleteAdminSchedule(id);
      await getSchedule();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus jadwal.');
    }
  };

  return { 
    data, isLoading, isMutating, error, 
    refetch: getSchedule, handleCreate, handleUpdate, handleDelete 
  };
};