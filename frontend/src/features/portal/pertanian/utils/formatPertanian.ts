export const formatPertanianDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDecimal = (num: number, maximumFractionDigits = 2) => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits,
  }).format(num);
};