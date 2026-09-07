import { useParams, Link } from 'react-router-dom';
import {
  IconArrowLeft,
  IconMapPin,
  IconPhone,
  IconBrandWhatsapp,
  IconBuildingStore,
} from '@tabler/icons-react';

import { usePublicUmkmDetail } from '../hooks/useUmkm';
import { formatRupiah } from '../utils/formatUmkm';
import { ShareButtons } from '../../../../shared/components/ShareButtons';

const PLACEHOLDER_IMAGE = 'https://placehold.co/1200x600/e9f1e2/72b841?text=Desa+Karangtengah';

export const UmkmDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: umkm, isLoading, error } = usePublicUmkmDetail(slug);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfcf8] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-8 h-8 w-32 rounded-full bg-[#e9f1e2]" />
          <div className="mb-8 h-[400px] w-full rounded-[24px] bg-[#e9f1e2]" />
          <div className="mb-4 h-10 w-3/4 rounded-lg bg-[#e9f1e2]" />
          <div className="mb-2 h-6 w-full rounded-lg bg-[#e9f1e2]" />
        </div>
      </div>
    );
  }

  if (error || !umkm) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fbfcf8] px-4">
        <div className="rounded-[24px] border border-dashed border-[#bdd9a8] bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#4f842f]">{error || 'UMKM tidak ditemukan.'}</p>
          <Link
            to="/umkm"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#72b841] px-6 text-sm font-bold text-white transition hover:bg-[#62a23a]"
          >
            <IconArrowLeft size={18} />
            Kembali ke UMKM
          </Link>
        </div>
      </div>
    );
  }

  const waLink = umkm.contactPhone
    ? `https://wa.me/${umkm.contactPhone.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <div className="min-h-screen bg-[#fbfcf8] px-4 pb-24 pt-8 text-[#101708] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[900px]">
        <Link
          to="/umkm"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#4f842f] transition hover:text-[#72b841]"
        >
          <IconArrowLeft size={18} />
          Kembali ke Direktori UMKM
        </Link>

        <header>
          <p className="w-fit rounded-full bg-[#e6f4dc] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#62a23a]">
            {umkm.category || 'Umum'}
          </p>
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.2] text-[#101708] sm:text-4xl lg:text-[42px]">
            {umkm.name}
          </h1>
          {umkm.ownerName && (
            <p className="mt-2 text-sm font-semibold text-[#6C757D]">Pemilik: {umkm.ownerName}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e5ecdf] pb-6">
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-[#6C757D]">
              {umkm.contactAddress && (
                <span className="inline-flex items-center gap-2">
                  <IconMapPin size={18} />
                  {umkm.contactAddress}
                </span>
              )}
              {umkm.contactPhone && (
                <span className="inline-flex items-center gap-2">
                  <IconPhone size={18} />
                  {umkm.contactPhone}
                </span>
              )}
            </div>
            <ShareButtons title={umkm.name} url={shareUrl} />
          </div>
        </header>

        <div className="my-10 overflow-hidden rounded-[24px] border border-[#e5ecdf] bg-[#eef3e8] shadow-[0_16px_40px_rgba(16,23,8,0.06)]">
          <img
            alt={umkm.name}
            className="aspect-[16/9] w-full object-cover"
            src={umkm.coverUrl || PLACEHOLDER_IMAGE}
          />
        </div>

        {umkm.description && (
          <p className="mb-8 text-base leading-7 text-[#3d453b]">{umkm.description}</p>
        )}

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10 inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white transition hover:bg-[#1ebc59]"
          >
            <IconBrandWhatsapp size={20} />
            Hubungi via WhatsApp
          </a>
        )}

        {umkm.products && umkm.products.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-[#101708]">
              <IconBuildingStore size={22} className="text-[#72b841]" />
              Produk
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {umkm.products.map((product, idx) => (
                <article
                  key={idx}
                  className="flex items-center gap-4 rounded-[16px] border border-[#e5ecdf] bg-white p-4 shadow-sm"
                >
                  {product.photoUrl ? (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-[#eef3e8] text-[#72b841]">
                      <IconBuildingStore size={24} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#101708]">{product.name}</h3>
                    <p className="text-sm font-semibold text-[#4f842f]">
                      {formatRupiah(product.price)} / {product.unit}
                    </p>
                    {product.note && <p className="mt-0.5 text-xs text-[#6C757D]">{product.note}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
