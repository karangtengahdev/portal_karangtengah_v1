import { useEffect, useState } from 'react';
import { fetchPublicUmkm } from '../api/umkmApi';
import type { PublicUmkmItem } from '../types/umkm';

export const usePublicUmkm = () => {
  const [data, setData] = useState<PublicUmkmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUmkm = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicUmkm();
        
        if (response.success) {
          setData(response.data.items || []);
        }
      } catch (error) {
        console.error('Gagal mengambil data UMKM publik:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getUmkm();
  }, []);

  return { data, isLoading };
};