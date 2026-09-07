import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminBerita,
  createAdminBerita,
  updateAdminBerita,
  deleteAdminBerita,
  uploadBeritaCover,
  publishAdminBerita,
} from '../api/beritaApi';
import { compressImage } from '../../../../shared/utils/compressImage';
import type { BeritaItem, BeritaPayload } from '../types/berita';

export const useAdminBerita = () => {
  const [data, setData] = useState<BeritaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBerita = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAdminBerita();
      if (response.success) {
        setData(response.data.items);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Gagal mengambil data berita.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getBerita();
  }, [getBerita]);

  // Buat berita, lalu (kalau ada file) upload cover pakai id yang baru dibuat.
  const handleCreate = async (payload: BeritaPayload, file: File | null) => {
    try {
      setIsMutating(true);
      const response = await createAdminBerita(payload);
      if (response.success && file) {
        // Kompres dulu sebelum upload -- foto asli dari HP gampang
        // >4.5MB (limit keras Vercel Serverless Functions), yang
        // manifest sbg error CORS di browser (request ditolak Vercel
        // sebelum sampai ke Express/NestJS yg CORS-nya sudah benar).
        const compressed = await compressImage(file);
        await uploadBeritaCover(response.data.id, compressed);
      }
      await getBerita();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal membuat berita baru.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, payload: BeritaPayload, file: File | null) => {
    try {
      setIsMutating(true);
      await updateAdminBerita(id, payload);
      if (file) {
        const compressed = await compressImage(file);
        await uploadBeritaCover(id, compressed);
      }
      await getBerita();
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      alert(apiError?.message || 'Gagal memperbarui berita.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus berita ini?')) return;
    try {
      await deleteAdminBerita(id);
      await getBerita();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal menghapus berita.');
    }
  };

  const handleTogglePublish = async (id: string) => {
    if (!window.confirm('Ubah status publikasi berita ini?')) return;
    try {
      await publishAdminBerita(id);
      await getBerita();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal mengubah status.');
    }
  };

  return {
    data,
    isLoading,
    isMutating,
    error,
    refetch: getBerita,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleTogglePublish,
  };
};
