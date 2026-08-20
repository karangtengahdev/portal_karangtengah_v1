import { useState, type ReactElement } from 'react';
import { IconClipboardList, IconPencilPlus, IconPlant2, IconScale, IconSearch, IconSeeding } from '@tabler/icons-react';

import { useAdminHarvest } from '../hooks/useHarvest';
import { HarvestTable } from '../components/HarvestTable';
import { HarvestModal } from '../components/HarvestModal';
import type { HarvestItem, HarvestPayload } from '../types/harvest';
import { formatDecimal } from '../utils/formatHarvest';

// Pola garis diagonal tipis ala "bedengan" — dipakai sebagai tekstur latar hero
const FURROW_PATTERN = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M0 48L48 0ZM-12 12L12 -12ZM36 60L60 36Z' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1.5'/%3E%3C/svg%3E\")",
};

export const AdminHarvestPage = (): ReactElement => {
  const { data: harvests, isLoading, isMutating, error, handleCreate, handleUpdate, handleDelete } = useAdminHarvest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HarvestItem | null>(null);

  // Kalkulasi Summary
  const totalArea = harvests.reduce((sum, item) => sum + item.areaHa, 0);
  const totalEstimatedHarvest = harvests.reduce((sum, item) => sum + item.estimatedKg, 0);

  const summary = [
    {
      label: 'Total Laporan',
      value: harvests.length,
      unit: 'laporan',
      icon: IconClipboardList,
      accentBg: 'bg-[#1F4A34]/10',
      accentText: 'text-[#1F4A34]',
      border: 'border-l-[#1F4A34]',
    },
    {
      label: 'Total Lahan Panen',
      value: formatDecimal(totalArea),
      unit: 'Ha',
      icon: IconPlant2,
      accentBg: 'bg-[#4C8C5B]/10',
      accentText: 'text-[#4C8C5B]',
      border: 'border-l-[#4C8C5B]',
    },
    {
      label: 'Total Estimasi Panen',
      value: formatDecimal(totalEstimatedHarvest),
      unit: 'Kg',
      icon: IconScale,
      accentBg: 'bg-[#D9A441]/15',
      accentText: 'text-[#8A5A3B]',
      border: 'border-l-[#D9A441]',
    },
  ];

  const handleOpenCreateModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleOpenEditModal = (item: HarvestItem) => { setEditingItem(item); setIsModalOpen(true); };

  const handleModalSubmit = async (payload: HarvestPayload) => {
    if (editingItem) await handleUpdate(editingItem.id, payload);
    else await handleCreate(payload);
  };

  return (
    <div className="space-y-5 sm:space-y-6 bg-[#F7F6EF] -m-4 p-4 sm:-m-6 sm:p-6 min-h-full">   {/* font-['Plus_Jakarta_Sans'] */}
      <HarvestModal opened={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingItem} isSubmitting={isMutating} />

      {/* Hero / field record banner */}
      <section
        className="relative overflow-hidden rounded-xl bg-[#1F4A34] px-5 py-7 sm:px-8 sm:py-9 shadow-sm"
        style={FURROW_PATTERN}
      >
        <IconSeeding className="pointer-events-none absolute -bottom-6 -right-6 text-white/10 sm:-right-4" size={140} stroke={1.2} />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D9A441]">
              Pertanian Desa
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-white">
              Laporan Panen
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Catat data hasil ubinan, kalkulasi hasil panen riil, dan tingkat kerugian akibat hama untuk bahan evaluasi ketahanan pangan.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#D9A441] px-5 text-sm font-semibold text-[#1F4A34] transition hover:bg-[#c79337] sm:w-fit"
          >
            <IconPencilPlus size={18} /> Input Data Panen
          </button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {summary.map((item) => (
          <article
            className={`rounded-lg border border-neutral-200 border-l-4 ${item.border} bg-white p-5 shadow-sm`}
            key={item.label}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{item.label}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1C2620]">
                  {item.value} <span className="text-sm font-medium text-neutral-400">{item.unit}</span>
                </p>
              </div>
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${item.accentBg} ${item.accentText}`}>
                <item.icon size={22} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Data table section */}
      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1C2620]">Data Pengukuran Panen</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Riwayat ubinan &amp; estimasi hasil per petani</p>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm text-neutral-500 sm:w-72">
            <IconSearch size={18} />
            <input className="w-full bg-transparent text-neutral-700 outline-none placeholder:text-neutral-400" placeholder="Cari laporan..." type="search" />
          </label>
        </div>

        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-sm font-medium text-neutral-500">Memuat data panen...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm font-medium text-[#C1502E]">{error}</div>
          ) : harvests.length > 0 ? (
            <HarvestTable items={harvests} onDelete={handleDelete} onEdit={handleOpenEditModal} />
          ) : (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <IconPlant2 size={32} className="text-neutral-300" />
              <p className="text-sm font-medium text-neutral-500">Belum ada laporan panen yang tercatat.</p>
              <p className="text-xs text-neutral-400">Mulai dengan menekan &quot;Input Data Panen&quot; di atas.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};