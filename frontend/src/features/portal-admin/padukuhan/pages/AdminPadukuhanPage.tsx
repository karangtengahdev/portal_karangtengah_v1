import { useRef, useState, type ReactElement } from 'react';
import {
  IconBuildingCommunity,
  IconPencilPlus,
  IconPhotoPlus,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react';

import { useAdminPadukuhan } from '../hooks/usePadukuhan';
import { PadukuhanModal } from '../components/PadukuhanModal';
import type { PadukuhanItem, PadukuhanPayload } from '../types/padukuhan';

const FURROW_PATTERN = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M0 48L48 0ZM-12 12L12 -12ZM36 60L60 36Z' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1.5'/%3E%3C/svg%3E\")",
};

export const AdminPadukuhanPage = (): ReactElement => {
  const {
    data: padukuhanList,
    isLoading,
    isMutating,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAddGallery,
    handleDeleteGallery,
  } = useAdminPadukuhan();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PadukuhanItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadId = useRef<string | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (item: PadukuhanItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload: PadukuhanPayload) => {
    if (editingItem) await handleUpdate(editingItem.id, payload);
    else await handleCreate(payload);
  };

  const triggerUpload = (id: string) => {
    activeUploadId.current = id;
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = activeUploadId.current;
    if (!file || !id) return;
    await handleAddGallery(id, file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5 sm:space-y-6 bg-[#F7F6EF] -m-4 p-4 sm:-m-6 sm:p-6 min-h-full font-['Plus_Jakarta_Sans']">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelected} />

      <PadukuhanModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
        isSubmitting={isMutating}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-xl bg-[#1F4A34] px-5 py-7 sm:px-8 sm:py-9 shadow-sm"
        style={FURROW_PATTERN}
      >
        <IconBuildingCommunity
          className="pointer-events-none absolute -bottom-6 -right-6 text-white/10 sm:-right-4"
          size={140}
          stroke={1.2}
        />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Struktur Kalurahan
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">Kelola Padukuhan</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Kalurahan Karangtengah terdiri atas 6 padukuhan. Tambahkan sambutan Kepala Dukuh dan
              galeri foto tiap padukuhan begitu datanya tersedia — yang belum diisi otomatis
              tampil "Segera Hadir" di halaman publik, bukan hilang atau error.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#D9A441] px-5 text-sm font-semibold text-[#1C2620] transition hover:bg-[#c79337] sm:w-fit"
          >
            <IconPencilPlus size={18} /> Tambah Padukuhan
          </button>
        </div>
      </section>

      {/* Daftar Padukuhan */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div className="h-48 animate-pulse rounded-lg bg-neutral-100" key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm font-medium text-[#C1502E]">
          {error}
        </div>
      ) : padukuhanList.length > 0 ? (
        <div className="space-y-4">
          {padukuhanList.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#1C2620]">{item.name}</h3>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                        item.hasData ? 'bg-[#4C8C5B]/15 text-[#1F4A34]' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {item.hasData ? 'TAMPIL DI PUBLIK' : 'SEGERA HADIR'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    {item.kepalaDukuh ? `Kepala Dukuh: ${item.kepalaDukuh}` : 'Kepala Dukuh belum diisi'}
                  </p>
                  {item.sambutan && (
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{item.sambutan}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-[#1F4A34] transition hover:bg-[#1F4A34]/5"
                  >
                    <IconEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-[#C1502E] transition hover:bg-[#C1502E]/10"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              </div>

              {/* Galeri per padukuhan */}
              <div className="border-t border-neutral-100 bg-[#F7F6EF] p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Galeri Foto ({item.gallery.length})
                  </p>
                  <button
                    onClick={() => triggerUpload(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F4A34] hover:underline"
                  >
                    <IconPhotoPlus size={14} /> Tambah Foto
                  </button>
                </div>
                {item.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {item.gallery.map((img) => (
                      <div key={img.id} className="group relative aspect-square overflow-hidden rounded-md bg-neutral-100">
                        <img src={img.imageUrl} alt={img.caption ?? ''} className="h-full w-full object-cover" />
                        <button
                          onClick={() => handleDeleteGallery(img.id)}
                          className="absolute inset-0 grid place-items-center bg-black/0 text-white/0 transition group-hover:bg-black/50 group-hover:text-white"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-neutral-400">Belum ada foto.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-white p-10 text-center">
          <IconBuildingCommunity size={32} className="text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">Belum ada padukuhan yang terdaftar.</p>
        </div>
      )}
    </div>
  );
};
