import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft, IconCalendarEvent, IconEye } from '@tabler/icons-react';

import { usePublicBeritaDetail } from '../hooks/useBerita';
import { formatBeritaDate, formatViews } from '../utils/formatBerita';

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x600/e9f1e2/72b841?text=Desa+Karangtengah';

export const BeritaDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: berita, isLoading, error } = usePublicBeritaDetail(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfcf8] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-32 rounded-full bg-[#e9f1e2] mb-8" />
          <div className="h-[400px] w-full rounded-[24px] bg-[#e9f1e2] mb-8" />
          <div className="h-10 w-3/4 rounded-lg bg-[#e9f1e2] mb-4" />
          <div className="h-6 w-full rounded-lg bg-[#e9f1e2] mb-2" />
          <div className="h-6 w-full rounded-lg bg-[#e9f1e2] mb-2" />
          <div className="h-6 w-5/6 rounded-lg bg-[#e9f1e2]" />
        </div>
      </div>
    );
  }

  if (error || !berita) {
    return (
      <div className="min-h-screen bg-[#fbfcf8] flex flex-col items-center justify-center px-4">
        <div className="rounded-[24px] border border-dashed border-[#bdd9a8] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#4f842f]">
            {error || 'Berita tidak ditemukan.'}
          </p>
          <Link
            to="/berita"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#72b841] px-6 text-sm font-bold text-white transition hover:bg-[#62a23a]"
          >
            <IconArrowLeft size={18} />
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcf8] px-4 pb-24 pt-8 text-[#101708] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[900px]">
        {/* Tombol Kembali */}
        <Link
          to="/berita"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4f842f] transition hover:text-[#72b841] mb-8"
        >
          <IconArrowLeft size={18} />
          Kembali ke Indeks Berita
        </Link>

        {/* Header Artikel */}
        <header>
          <p className="w-fit rounded-full bg-[#e6f4dc] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#62a23a]">
            {berita.category || 'Umum'}
          </p>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.2] text-[#101708] sm:text-4xl lg:text-[42px]">
            {berita.title}
          </h1>
          
          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-[#6C757D] pb-6 border-b border-[#e5ecdf]">
            <span className="inline-flex items-center gap-2">
              <IconCalendarEvent size={18} />
              {formatBeritaDate(berita.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <IconEye size={18} />
              {formatViews(berita.views || 0)} kali dilihat
            </span>
          </div>
        </header>

        {/* Gambar Cover Utama */}
        <div className="my-10 overflow-hidden rounded-[24px] border border-[#e5ecdf] bg-[#eef3e8] shadow-[0_16px_40px_rgba(16,23,8,0.06)]">
          <img
            alt={berita.title}
            className="aspect-[16/9] w-full object-cover"
            src={berita.coverUrl || PLACEHOLDER_IMAGE}
          />
        </div>

        {/* Isi Konten Berita */}
        <article className="prose prose-lg max-w-none text-[#3d453b] prose-p:leading-relaxed prose-headings:text-[#101708] prose-a:text-[#4f842f]">
          {/* Gunakan dangerouslySetInnerHTML JIKA backend mengirim teks HTML (seperti dari text editor CMS). 
            Jika hanya string biasa, hapus dangerouslySetInnerHTML dan gunakan {berita.content} di dalam tag <p>.
          */}
          {berita.excerpt ? (
            <div dangerouslySetInnerHTML={{ __html: berita.excerpt }} />
          ) : (
            <p className="whitespace-pre-line leading-loose text-lg">
              {berita.excerpt || 'Belum ada konten untuk berita ini.'}
            </p>
          )}
        </article>
      </div>
    </div>
  );
};