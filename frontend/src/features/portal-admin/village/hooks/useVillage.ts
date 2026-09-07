import { useCallback, useEffect, useState } from 'react';
import { 
  fetchVillageProfile, updateVillageProfile, 
  uploadGalleryImage, addGalleryItem, deleteGalleryItem 
} from '../api/villageApi';
import type { VillageItem, VillagePayload } from '../types/village';

export const useAdminVillage = () => {
  const [data, setData] = useState<VillageItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVillage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchVillageProfile();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError('Profil desa belum tersedia atau gagal dimuat.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal mengambil data profil desa.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getVillage();
  }, [getVillage]);

  const handleUpdateProfile = async (payload: VillagePayload) => {
    try {
      setIsMutating(true);
      await updateVillageProfile(payload);
      await getVillage();
      alert('Profil desa berhasil diperbarui!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleAddGallery = async (file: File, caption: string, orderIndex: number) => {
    try {
      setIsMutating(true);
      const uploadRes = await uploadGalleryImage(file);
      const imageUrl = uploadRes.data?.url || uploadRes.imageUrl || uploadRes.url || '';

      if (!imageUrl) throw new Error('Gagal mendapatkan URL gambar dari server.');
      await addGalleryItem({ imageUrl, caption, orderIndex });
      await getVillage();
    } catch (err: any) {
      alert(err.message || err.response?.data?.message || 'Gagal menambahkan galeri.');
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Hapus foto ini dari galeri?')) return;
    try {
      setIsMutating(true);
      await deleteGalleryItem(id);
      await getVillage();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus foto galeri.');
    } finally {
      setIsMutating(false);
    }
  };

  return { 
    data, isLoading, isMutating, error, 
    handleUpdateProfile, handleAddGallery, handleDeleteGallery 
  };
};