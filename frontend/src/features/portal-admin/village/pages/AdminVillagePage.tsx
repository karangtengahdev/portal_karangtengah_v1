import { useState, type ReactElement } from 'react';
import { IconBuildingCommunity, IconPhotoPlus, IconSeeding, IconTrash } from '@tabler/icons-react';

import { useAdminVillage } from '../hooks/useVillage';
import { VillageProfileForm } from '../components/VillageProfileForm';
import { GalleryModal } from '../components/GalleryModal';

// Pola garis diagonal tipis ala "bedengan" — dipakai sebagai tekstur latar hero
const FURROW_PATTERN = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M0 48L48 0ZM-12 12L12 -12ZM36 60L60 36Z' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1.5'/%3E%3C/svg%3E\")",
};

export const AdminVillagePage = (): ReactElement => {
  const { data, isLoading, isMutating, error, handleUpdateProfile, handleAddGallery, handleDeleteGallery } = useAdminVillage();
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center font-medium text-[#1F4A34] animate-pulse font-['Plus_Jakarta_Sans']">
        Memuat profil desa...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-sm font-medium text-[#C1502E] font-['Plus_Jakarta_Sans']">
        {error || 'Data profil desa tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 bg-[#F7F6EF] -m-4 p-4 sm:-m-6 sm:p-6 min-h-full font-['Plus_Jakarta_Sans']">
      <GalleryModal
        opened={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSubmit={handleAddGallery}
        isSubmitting={isMutating}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-xl bg-[#1F4A34] px-5 py-7 sm:px-8 sm:py-9 shadow-sm"
        style={FURROW_PATTERN}
      >
        <IconSeeding className="pointer-events-none absolute -bottom-6 -right-6 text-white/10 sm:-right-4" size={140} stroke={1.2} />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10 text-[#D9A441]">
            <IconBuildingCommunity size={26} />
          </div>
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Profil Desa
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">Profil Desa Utama</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
              Ubah visi, misi, deskripsi, hingga potensi yang akan ditampilkan ke publik.
            </p>
          </div>
        </div>
      </section>

      {/* Form Profil Utama */}
      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-200 bg-[#F7F6EF] px-5 sm:px-6 py-4">
          <h3 className="font-semibold text-[#1C2620]">Form Informasi Profil</h3>
        </div>
        <VillageProfileForm
          initialData={data}
          onSubmit={handleUpdateProfile}
          isSubmitting={isMutating}
        />
      </section>

      {/* Bagian Galeri */}
      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-neutral-200 bg-[#F7F6EF] px-5 sm:px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-[#1C2620]">Galeri Foto Desa</h3>
            <p className="mt-1 text-sm text-neutral-500">Kelola foto-foto yang akan muncul di *slider* atau dokumentasi halaman utama.</p>
          </div>
          <button
            onClick={() => setIsGalleryModalOpen(true)}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1F4A34] px-4 text-sm font-medium text-white transition hover:bg-[#173a29] md:w-fit"
          >
            <IconPhotoPlus size={18} /> Tambah Foto
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {data.gallery && data.gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {data.gallery
                .sort((a, b) => a.orderIndex - b.orderIndex) // Urutkan sesuai index
                .map((img) => (
                <div key={img.id} className="group relative rounded-lg border border-neutral-200 overflow-hidden bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#F7F6EF]">
                    <img src={img.imageUrl} alt={img.caption} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-3 flex justify-between items-start gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1C2620] line-clamp-2">{img.caption}</p>
                      <p className="text-xs text-neutral-500 mt-1">Urutan Tampil: {img.orderIndex}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(img.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#C1502E] hover:bg-[#C1502E]/10 transition"
                      title="Hapus Foto"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500 text-sm bg-[#F7F6EF] rounded-lg border border-dashed border-neutral-200">
              Belum ada foto galeri. Silakan tambahkan.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};