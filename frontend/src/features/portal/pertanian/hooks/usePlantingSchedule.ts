import { useCallback, useEffect, useState } from 'react';
import { fetchPublicJadwalTanam, fetchPublicKomoditas } from '../api/plantingScheduleApi';
import type { MusimTanam, Komoditas } from '../types/plantingSchedule';

export const usePublicJadwalTanam = (filterKomoditasId?: string) => {
  const [data, setData] = useState<MusimTanam[]>([]);
  const [komoditasList, setKomoditasList] = useState<Komoditas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [jadwalRes, komoditasRes] = await Promise.all([
        fetchPublicJadwalTanam(filterKomoditasId, 'AKTIF'),
        fetchPublicKomoditas(),
      ]);
      if (jadwalRes.success) setData(jadwalRes.data);
      if (komoditasRes.success) setKomoditasList(komoditasRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Gagal memuat data jadwal tanam.');
    } finally {
      setIsLoading(false);
    }
  }, [filterKomoditasId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, komoditasList, isLoading, error };
};
