import { useEffect, useState } from 'react';
import { fetchPublicBerita, fetchPublicBeritaBySlug } from '../api/beritaApi';
import type { PublicBeritaItem } from '../types/berita';

export const usePublicBerita = () => {
  const [data, setData] = useState<PublicBeritaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getBerita = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPublicBerita();
        
        if (response.success) {
          const items = Array.isArray(response.data) ? response.data : (response.data?.items || []);
          setData(items);
        }
      } catch (error) {
        console.error('Gagal mengambil berita publik:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBerita();
  }, []);

  return { data, isLoading };
};

export const usePublicBeritaDetail = (slug: string | undefined) => {
  const [data, setData] = useState<PublicBeritaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getBeritaDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchPublicBeritaBySlug(slug);
        
        if (response.success) {
          setData(response.data);
        } else {
          setError('Berita tidak ditemukan.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal mengambil detail berita.');
      } finally {
        setIsLoading(false);
      }
    };

    getBeritaDetail();
  }, [slug]);

  return { data, isLoading, error };
};