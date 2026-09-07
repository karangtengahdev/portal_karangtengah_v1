import { useCallback, useEffect, useState } from 'react';
import {
  fetchAdminPadukuhan,
  createAdminPadukuhan,
  updateAdminPadukuhan,
  deleteAdminPadukuhan,
  uploadPadukuhanGallery,
  deletePadukuhanGallery,
} from '../api/padukuhanApi';
import { compressImage } from '../../../../shared/utils/compressImage';
import type { PadukuhanItem, PadukuhanPayload } from '../types/padukuhan';

export const useAdminPadukuhan = () => {
  const [data, setData] = useState<PadukuhanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPadukuhan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAdminPadukuhan();
      if (response.success) setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Gagal mengambil data padukuhan.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getPadukuhan();
  }, [getPadukuhan]);

  const handleCreate = async (payload: PadukuhanPayload) => {
    try {
      setIsMutating(true);
      await createAdminPadukuhan(payload);
      await getPadukuhan();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal menambah padukuhan.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleUpdate = async (id: string, payload: PadukuhanPayload) => {
    try {
      setIsMutating(true);
      await updateAdminPadukuhan(id, payload);
      await getPadukuhan();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal memperbarui padukuhan.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus padukuhan ini beserta seluruh galerinya?')) return;
    try {
      await deleteAdminPadukuhan(id);
      await getPadukuhan();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal menghapus padukuhan.');
    }
  };

  // Kompres dulu sebelum upload -- sama alasannya dgn cover berita:
  // foto asli dari HP gampang lewat batas 4.5MB Vercel Serverless.
  const handleAddGallery = async (id: string, file: File, caption?: string) => {
    try {
      setIsMutating(true);
      const compressed = await compressImage(file);
      await uploadPadukuhanGallery(id, compressed, caption);
      await getPadukuhan();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (!window.confirm('Hapus foto ini?')) return;
    try {
      await deletePadukuhanGallery(galleryId);
      await getPadukuhan();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Gagal menghapus foto.');
    }
  };

  return {
    data,
    isLoading,
    isMutating,
    error,
    refetch: getPadukuhan,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAddGallery,
    handleDeleteGallery,
  };
};
