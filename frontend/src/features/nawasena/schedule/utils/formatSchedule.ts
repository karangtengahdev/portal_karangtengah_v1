export const formatScheduleDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getScheduleStatusLabel = (status: string) => {
  switch (status) {
    case 'planned': return 'Rencana Tanam';
    case 'planted': return 'Sedang Ditanam';
    case 'harvested': return 'Sudah Panen';
    default: return status;
  }
};

export const getScheduleStatusClass = (status: string) => {
  switch (status) {
    case 'planned': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'planted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'harvested': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
};