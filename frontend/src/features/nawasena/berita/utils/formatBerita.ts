import type {
  BeritaHomepagePlacement,
  BeritaStatus,
} from '../types/berita';

export const formatBeritaDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};

export const formatViews = (views: number) =>
  new Intl.NumberFormat('id-ID').format(views);

export const getStatusLabel = (status: BeritaStatus) => {
  const labels: Record<BeritaStatus, string> = {
    archived: 'Arsip',
    draft: 'Draft',
    published: 'Terbit',
    review: 'Review',
  };

  return labels[status];
};

export const getHomepagePlacementLabel = (
  placement: BeritaHomepagePlacement,
) => {
  const labels: Record<BeritaHomepagePlacement, string> = {
    featured: 'Sorotan Utama',
    none: 'Tidak tampil',
    supporting: 'Pendukung',
  };

  return labels[placement];
};

