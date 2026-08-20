export const formatHarvestDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDecimal = (num: number, maximumFractionDigits = 2) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits,
  }).format(num);
};