import { useCallback, useEffect, useState } from 'react';
import { 
  fetchAdminUmkm, createAdminUmkm, updateAdminUmkm, 
  deleteAdminUmkm, uploadUmkmCover, publishAdminUmkm 
} from '../api/umkmApi';
import type { UmkmItem, UmkmPayload } from '../types/umkm';

export const useAdminUmkm = () => {
  const [data, setData] = useState<UmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUmkm = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAdminUmkm();
      if (response.success) {
        setData(response.data.items);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data UMKM.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUmkm();
  }, [getUmkm]);

  const handleCreate = async (payload: UmkmPayload, file: File | null) => {
    try {
      setIsMutating(true);
      const response = await createAdminUmkm(payload);
      if (response.success && file) {
        await uploadUmkmCover(response.data.id, file);
      }
      await getUmkm();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal membuat UMKM baru.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, payload: UmkmPayload, file: File | null) => {
    try {
      setIsMutating(true);
      await updateAdminUmkm(id, payload);
      if (file) {
        await uploadUmkmCover(id, file);
      }
      await getUmkm();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal memperbarui UMKM.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus data UMKM ini?')) return;
    try {
      await deleteAdminUmkm(id);
      await getUmkm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus UMKM.');
    }
  };

  const handleTogglePublish = async (id: string) => {
    if (!window.confirm('Ubah status publikasi UMKM ini?')) return;
    try {
      await publishAdminUmkm(id);
      await getUmkm();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status.');
    }
  };

  return { 
    data, isLoading, isMutating, error, 
    refetch: getUmkm, handleCreate, handleUpdate, handleDelete, handleTogglePublish 
  };
};