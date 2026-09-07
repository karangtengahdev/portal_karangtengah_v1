import { useEffect, useState } from 'react';
import { fetchPublicUmkm, fetchPublicUmkmBySlug } from '../api/umkmApi';
import type { PublicUmkmItem, PublicUmkmDetail } from '../types/umkm';

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

export const usePublicUmkmDetail = (slug: string | undefined) => {
  const [data, setData] = useState<PublicUmkmDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchPublicUmkmBySlug(slug);

        if (response.success) {
          setData(response.data);
        } else {
          setError('UMKM tidak ditemukan.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal mengambil detail UMKM.');
      } finally {
        setIsLoading(false);
      }
    };

    getDetail();
  }, [slug]);

  return { data, isLoading, error };
};
