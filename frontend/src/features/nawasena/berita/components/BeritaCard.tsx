import { IconEdit, IconEye, IconPhoto, IconTag, IconTrash, IconUpload } from '@tabler/icons-react';
import type { BeritaItem, BeritaStatus } from '../types/berita';
import { getStatusLabel } from '../utils/formatBerita';

type BeritaCardProps = {
  article: BeritaItem;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, status: BeritaStatus) => void;
  onEdit: (article: BeritaItem) => void;
  onUploadCover: (id: string) => void;
};

const getStatusClass = (status: BeritaStatus) => {
  if (status === 'published') return 'bg-[#4C8C5B]/15 text-[#1F4A34]';
  return 'bg-neutral-100 text-neutral-600'; // draft
};

// const getPlacementClass = (placement: BeritaHomepagePlacement) => {
//   if (placement === 'featured') return 'border-[#f8cd24]/50 bg-[#fff8d8] text-[#8a6500]';
//   if (placement === 'supporting') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
//   return 'border-neutral-200 bg-neutral-50 text-neutral-500';
// };

export const BeritaCard = ({ article, onDelete, onEdit, onTogglePublish, onUploadCover }: BeritaCardProps) => {
  return (
    <article className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[168px_1fr_auto] lg:items-center">
      <div className="relative group">
        {article.coverUrl ? (
          <img alt={article.title} className="h-40 w-full rounded-lg object-cover sm:h-36 lg:h-28" src={article.coverUrl} />
        ) : (
          <div className="grid h-40 w-full place-items-center rounded-lg bg-[#F7F6EF] text-neutral-400 sm:h-36 lg:h-28">
            <IconPhoto size={26} />
          </div>
        )}
        {/* Tombol Overlay Upload Gambar */}
        <button
          onClick={() => onUploadCover(article.id)}
          className="absolute inset-0 grid place-items-center rounded-lg bg-black/0 text-white/0 transition group-hover:bg-black/50 group-hover:text-white"
        >
          <IconUpload size={24} />
        </button>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#4C8C5B]/10 px-3 py-1 text-xs font-semibold text-[#1F4A34]">
            <IconTag size={14} /> {article.category || 'Umum'}
          </span>
          <button
            onClick={() => onTogglePublish(article.id, article.status)}
            className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer hover:opacity-80 transition ${getStatusClass(article.status)}`}
            title="Klik untuk ubah status publish"
          >
            {getStatusLabel(article.status)}
          </button>
          {/* <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getPlacementClass(article.homepagePlacement ?? 'none')}`}>
            <IconHomeStats size={14} /> {getHomepagePlacementLabel(article.homepagePlacement ?? 'none')}
          </span> */}
        </div>

        <h4 className="mt-3 max-w-2xl text-base font-semibold leading-snug text-[#1C2620]">
          {article.title}
        </h4>
        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-neutral-600">
          {article.excerpt || 'Belum ada ringkasan.'}
        </p>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-500">
          <p>{article.author || 'Admin'}</p>
          <p className="inline-flex items-center gap-1.5"><IconEye size={16} />— dilihat</p>
        </div>
      </div>

      <div className="flex gap-2 lg:justify-end">
        <button
          onClick={() => onEdit(article)}
          title="Edit Data"
          className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-[#1F4A34] transition hover:bg-[#1F4A34]/5"
        >
          <IconEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(article.id)}
          title="Hapus Berita"
          className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-[#C1502E] transition hover:bg-[#C1502E]/10"
        >
          <IconTrash size={18} />
        </button>
      </div>
    </article>
  );
};