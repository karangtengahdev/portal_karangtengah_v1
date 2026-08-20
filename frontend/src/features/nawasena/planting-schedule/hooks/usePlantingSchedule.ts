import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import {
  fetchAdminMusimTanam,
  createAdminMusimTanam,
  updateAdminMusimTanam,
  deleteAdminMusimTanam,
  createTahapan,
  updateTahapan,
  deleteTahapan,
  fetchKomoditas,
  createKomoditas,
} from '../api/plantingScheduleApi';
import type { MusimTanam, Komoditas, CreateMusimTanamPayload, CreateTahapanPayload } from '../types/plantingSchedule';

export const useAdminPlantingSchedule = (initialFilters?: { status?: string; komoditasId?: string }) => {
  const [data, setData] = useState<MusimTanam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (filters?: { status?: string; komoditasId?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminMusimTanam(filters || initialFilters);
      if (response.success) {
        setData(response.data);
      } else {
        setError('Gagal memuat data musim tanam.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (payload: CreateMusimTanamPayload) => {
    try {
      await createAdminMusimTanam(payload);
      notifications.show({ title: 'Berhasil', message: 'Musim tanam berhasil ditambahkan', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal menambahkan musim tanam', color: 'red' });
      return false;
    }
  };

  const handleUpdate = async (id: string, payload: Partial<CreateMusimTanamPayload>) => {
    try {
      await updateAdminMusimTanam(id, payload);
      notifications.show({ title: 'Berhasil', message: 'Musim tanam berhasil diubah', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal mengubah musim tanam', color: 'red' });
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminMusimTanam(id);
      notifications.show({ title: 'Berhasil', message: 'Musim tanam berhasil dihapus', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal menghapus musim tanam', color: 'red' });
      return false;
    }
  };

  const handleCreateTahapan = async (musimTanamId: string, payload: CreateTahapanPayload) => {
    try {
      await createTahapan(musimTanamId, payload);
      notifications.show({ title: 'Berhasil', message: 'Tahapan berhasil ditambahkan', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal menambahkan tahapan', color: 'red' });
      return false;
    }
  };

  const handleUpdateTahapan = async (id: string, payload: Partial<CreateTahapanPayload>) => {
    try {
      await updateTahapan(id, payload);
      notifications.show({ title: 'Berhasil', message: 'Tahapan berhasil diubah', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal mengubah tahapan', color: 'red' });
      return false;
    }
  };

  const handleDeleteTahapan = async (id: string) => {
    try {
      await deleteTahapan(id);
      notifications.show({ title: 'Berhasil', message: 'Tahapan berhasil dihapus', color: 'green' });
      loadData();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal menghapus tahapan', color: 'red' });
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateTahapan,
    handleUpdateTahapan,
    handleDeleteTahapan,
  };
};

export const useKomoditas = () => {
  const [komoditas, setKomoditas] = useState<Komoditas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadKomoditas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchKomoditas();
      if (response.success) {
        setKomoditas(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat komoditas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKomoditas();
  }, [loadKomoditas]);

  const handleCreateKomoditas = async (payload: { nama: string; deskripsi?: string }) => {
    try {
      await createKomoditas(payload);
      notifications.show({ title: 'Berhasil', message: 'Komoditas berhasil ditambahkan', color: 'green' });
      loadKomoditas();
      return true;
    } catch (err: any) {
      notifications.show({ title: 'Gagal', message: err.response?.data?.message || 'Gagal menambahkan komoditas', color: 'red' });
      return false;
    }
  };

  return {
    komoditas,
    loading,
    error,
    loadKomoditas,
    handleCreateKomoditas,
  };
};
