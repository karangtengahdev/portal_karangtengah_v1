import { Link } from 'react-router-dom';
import { IconArrowRight, IconBookmark, IconCalendarEvent, IconUser } from '@tabler/icons-react';
import type { PublicBeritaItem } from '../types/berita';
import { formatBeritaDate } from '../utils/formatBerita';

const PLACEHOLDER_IMAGE = 'https://placehold.co/800x450/e9f1e2/72b841?text=Desa+Karangtengah';

type PublicBeritaCardProps = {
  item: PublicBeritaItem;
};

export const PublicBeritaCard = ({ item }: PublicBeritaCardProps) => {
  return (
    <article className="group overflow-hidden rounded-[14px] border border-[#e5ecdf] bg-white shadow-[0_12px_32px_rgba(16,23,8,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(16,23,8,0.13)] flex flex-col sm:rounded-[20px]">
      <div className="relative overflow-hidden bg-[#eef3e8]">
        <img
          alt={item.title}
          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105"
          src={item.coverUrl || PLACEHOLDER_IMAGE}
        />
        <span className="absolute right-3 top-3 hidden h-8 w-8 place-items-center rounded-full bg-white text-[#101708] shadow-[0_10px_24px_rgba(16,23,8,0.16)] sm:right-5 sm:top-4 sm:grid sm:h-11 sm:w-11">
          <IconBookmark size={15} stroke={1.8} className="hidden sm:block" />
          <IconBookmark size={19} stroke={1.8} className="sm:hidden" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-6">
        <h3 className="mt-1 line-clamp-2 text-sm font-extrabold leading-snug text-[#101708] sm:mt-4 sm:text-xl">
          {item.title}
        </h3>

        <div className="mt-1 flex flex-col gap-2 text-[#6C757D] sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:text-sm">
          <div className="flex flex-col gap-1 text-[10px] sm:flex-row sm:flex-wrap sm:gap-5 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <IconCalendarEvent size={12} className="sm:hidden" />
              <IconCalendarEvent size={16} className="hidden sm:block" />
              {formatBeritaDate(item.publishedAt)}
            </span>
            {item.author && (
              <span className="inline-flex items-center gap-1.5">
                <IconUser size={12} className="sm:hidden" />
                <IconUser size={16} className="hidden sm:block" />
                {item.author}
              </span>
            )}
          </div>

          <Link
            to={`/berita/${item.slug}`}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#4f842f] hover:underline sm:gap-1.5 sm:text-sm"
          >
            Baca selengkapnya
            <IconArrowRight size={12} className="sm:hidden" />
            <IconArrowRight size={16} className="hidden sm:block" />
          </Link>
        </div>
      </div>
    </article>
  );
};
