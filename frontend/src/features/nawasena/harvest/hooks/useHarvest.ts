import { useCallback, useEffect, useState } from 'react';
import { fetchAdminHarvest, createAdminHarvest, updateAdminHarvest, deleteAdminHarvest } from '../api/harvestApi';
import type { HarvestItem, HarvestPayload } from '../types/harvest';

export const useAdminHarvest = () => {
  const [data, setData] = useState<HarvestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHarvest = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAdminHarvest();
      if (response.success) {
        setData(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data laporan panen.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getHarvest();
  }, [getHarvest]);

  const handleCreate = async (payload: HarvestPayload) => {
    try {
      setIsMutating(true);
      await createAdminHarvest(payload);
      await getHarvest();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal menyimpan data panen baru.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, payload: HarvestPayload) => {
    try {
      setIsMutating(true);
      await updateAdminHarvest(id, payload);
      await getHarvest();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal memperbarui data panen.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus laporan panen ini?')) return;
    try {
      await deleteAdminHarvest(id);
      await getHarvest();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus laporan.');
    }
  };

  return { 
    data, isLoading, isMutating, error, 
    refetch: getHarvest, handleCreate, handleUpdate, handleDelete 
  };
};