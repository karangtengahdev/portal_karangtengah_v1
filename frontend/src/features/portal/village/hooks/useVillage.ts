import { useEffect, useState } from 'react';
import { fetchPublicVillage } from '../api/villageApi';
import type { PublicVillageProfile } from '../types/village';

export const usePublicVillage = () => {
  const [data, setData] = useState<PublicVillageProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicVillage();
        if (response.success) setData(response.data);
      } catch (error) {
        console.error('Gagal mengambil profil desa:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { data, isLoading };
};
