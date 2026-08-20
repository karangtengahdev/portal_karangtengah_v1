import { useRef, useState, type ReactElement } from 'react';
import { IconBuildingStore, IconPencilPlus, IconSearch, IconSeeding, IconShoppingCart, IconToolsKitchen2 } from '@tabler/icons-react';

import { useAdminUmkm } from '../hooks/useUmkm';
import { UmkmCard } from '../components/UmkmCard';
import { UmkmModal } from '../components/UmkmModal';
import { uploadUmkmCover } from '../api/umkmApi';
import type { UmkmItem, UmkmPayload } from '../types/umkm';

// Pola garis diagonal tipis ala "bedengan" — dipakai sebagai tekstur latar hero
const FURROW_PATTERN = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M0 48L48 0ZM-12 12L12 -12ZM36 60L60 36Z' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1.5'/%3E%3C/svg%3E\")",
};

export const AdminUmkmPage = (): ReactElement => {
  const { data: umkms, isLoading, isMutating, error, refetch, handleCreate, handleUpdate, handleDelete, handleTogglePublish } = useAdminUmkm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UmkmItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadId = useRef<string | null>(null);

  const publishedCount = umkms.filter((u) => u.status === 'published').length;
  const foodCount = umkms.filter((u) => u.category.toLowerCase() === 'makanan').length;

  // Total semua produk dari seluruh UMKM
  const totalProducts = umkms.reduce((sum, umkm) => sum + (umkm.products?.length || 0), 0);

  const summary = [
    {
      label: 'Total UMKM',
      value: umkms.length,
      icon: IconBuildingStore,
      accentBg: 'bg-[#1F4A34]/10',
      accentText: 'text-[#1F4A34]',
      border: 'border-l-[#1F4A34]',
    },
    {
      label: 'Aktif / Published',
      value: publishedCount,
      icon: IconBuildingStore,
      accentBg: 'bg-[#4C8C5B]/10',
      accentText: 'text-[#4C8C5B]',
      border: 'border-l-[#4C8C5B]',
    },
    {
      label: 'Total Produk',
      value: totalProducts,
      icon: IconShoppingCart,
      accentBg: 'bg-[#D9A441]/15',
      accentText: 'text-[#8A5A3B]',
      border: 'border-l-[#D9A441]',
    },
    {
      label: 'UMKM Makanan',
      value: foodCount,
      icon: IconToolsKitchen2,
      accentBg: 'bg-[#C1502E]/10',
      accentText: 'text-[#C1502E]',
      border: 'border-l-[#C1502E]',
    },
  ];

  const handleOpenCreateModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleOpenEditModal = (item: UmkmItem) => { setEditingItem(item); setIsModalOpen(true); };

  const handleModalSubmit = async (payload: UmkmPayload, file: File | null) => {
    if (editingItem) await handleUpdate(editingItem.id, payload, file);
    else await handleCreate(payload, file);
  };

  const triggerUploadCover = (id: string) => {
    activeUploadId.current = id;
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = activeUploadId.current;
    if (!file || !id) return;
    try {
      await uploadUmkmCover(id, file);
      refetch();
    } catch (error) { alert('Gagal upload gambar'); }
    finally { if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  return (
    <div className="space-y-5 sm:space-y-6 bg-[#F7F6EF] -m-4 p-4 sm:-m-6 sm:p-6 min-h-full font-['Plus_Jakarta_Sans']">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelected} />

      <UmkmModal opened={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingItem} isSubmitting={isMutating} />

      {/* Hero / pasar desa banner */}
      <section
        className="relative overflow-hidden rounded-xl bg-[#1F4A34] px-5 py-7 sm:px-8 sm:py-9 shadow-sm"
        style={FURROW_PATTERN}
      >
        <IconSeeding className="pointer-events-none absolute -bottom-6 -right-6 text-white/10 sm:-right-4" size={140} stroke={1.2} />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Potensi Desa
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
              Data UMKM
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Kelola direktori UMKM lokal beserta katalog produk yang ditawarkan untuk dipromosikan di portal publik.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#D9A441] px-5 text-sm font-semibold text-[#1C2620] transition hover:bg-[#c79337] sm:w-fit"
          >
            <IconPencilPlus size={18} /> Daftar UMKM Baru
          </button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            className={`rounded-lg border border-neutral-200 border-l-4 ${item.border} bg-white p-4 sm:p-5 shadow-sm`}
            key={item.label}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{item.label}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1C2620]">{item.value}</p>
              </div>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${item.accentBg} ${item.accentText}`}>
                <item.icon size={22} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Directory */}
      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-[#1C2620]">Direktori UMKM</h3>
            <p className="mt-1 text-sm text-neutral-600">Data usaha dan katalog produk yang tampil di portal publik.</p>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm text-neutral-500 lg:w-72">
            <IconSearch size={18} />
            <input className="w-full bg-transparent text-neutral-700 outline-none placeholder:text-neutral-400" placeholder="Cari nama UMKM..." type="search" />
          </label>
        </div>

        {isLoading ? (
          <div className="grid gap-4 p-5">
            {Array.from({ length: 3 }).map((_, idx) => <div className="h-32 animate-pulse rounded-lg bg-neutral-100" key={idx} />)}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-[#C1502E]">{error}</div>
        ) : umkms.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {umkms.map((item) => (
              <UmkmCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleOpenEditModal} onTogglePublish={handleTogglePublish} onUploadCover={triggerUploadCover} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <IconBuildingStore size={32} className="text-neutral-300" />
            <p className="text-sm font-medium text-neutral-500">Belum ada UMKM yang terdaftar.</p>
          </div>
        )}
      </section>
    </div>
  );
};