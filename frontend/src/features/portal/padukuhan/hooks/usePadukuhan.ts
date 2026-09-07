import { useEffect, useState } from 'react';
import { fetchPublicPadukuhan } from '../api/padukuhanApi';
import type { PublicPadukuhanItem } from '../types/padukuhan';

export const usePublicPadukuhan = () => {
  const [data, setData] = useState<PublicPadukuhanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicPadukuhan();
        if (response.success) setData(response.data);
      } catch (error) {
        console.error('Gagal mengambil data padukuhan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { data, isLoading };
};
