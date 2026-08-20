export const formatBeritaDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatViews = (views: number | undefined) => {
  if (!views) return '0';
  return new Intl.NumberFormat('id-ID').format(views);
};