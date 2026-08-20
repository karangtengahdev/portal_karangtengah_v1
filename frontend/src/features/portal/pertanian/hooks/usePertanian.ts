import { useEffect, useState } from 'react';
import { fetchPublicHarvest, fetchPublicHarvestStats } from '../api/pertanianApi';
import type { PublicHarvestItem, PublicHarvestStats } from '../types/pertanian';

export const usePublicPertanian = () => {
  const [harvests, setHarvests] = useState<PublicHarvestItem[]>([]);
  const [stats, setStats] = useState<PublicHarvestStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch kedua API secara bersamaan
        const [harvestRes, statsRes] = await Promise.all([
          fetchPublicHarvest(),
          fetchPublicHarvestStats(),
        ]);

        if (harvestRes.success) setHarvests(harvestRes.data || []);
        if (statsRes.success) setStats(statsRes.data || null);
      } catch (err: any) {
        console.error('Gagal mengambil data pertanian:', err);
        setError('Gagal memuat data pertanian. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { harvests, stats, isLoading, error };
};