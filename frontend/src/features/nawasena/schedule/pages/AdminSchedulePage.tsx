import { useState, type ReactElement } from 'react';
import { IconCalendarTime, IconLeaf, IconPencilPlus, IconPlant, IconSearch } from '@tabler/icons-react';

import { useAdminSchedule } from '../hooks/useSchedule';
import { ScheduleCard } from '../components/ScheduleCard';
import { ScheduleModal } from '../components/ScheduleModal';
import type { ScheduleItem, SchedulePayload } from '../types/schedule';

export const AdminSchedulePage = (): ReactElement => {
  const { data: schedules, isLoading, isMutating, error, handleCreate, handleUpdate, handleDelete } = useAdminSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const plannedCount = schedules.filter((s) => s.status === 'planned').length;
  const plantedCount = schedules.filter((s) => s.status === 'planted').length;

  const summary = [
    { label: 'Total Jadwal', value: schedules.length, icon: IconCalendarTime, accent: 'bg-emerald-100 text-emerald-700' },
    { label: 'Sedang Ditanam', value: plantedCount, icon: IconPlant, accent: 'bg-green-100 text-green-700' },
    { label: 'Rencana Tanam', value: plannedCount, icon: IconLeaf, accent: 'bg-amber-100 text-amber-700' },
  ];

  const handleOpenCreateModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleOpenEditModal = (item: ScheduleItem) => { setEditingItem(item); setIsModalOpen(true); };

  const handleModalSubmit = async (payload: SchedulePayload) => {
    if (editingItem) await handleUpdate(editingItem.id, payload);
    else await handleCreate(payload);
  };

  return (
    <div className="space-y-6">
      <ScheduleModal opened={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingItem} isSubmitting={isMutating} />

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Pertanian Desa</p>
            <h2 className="mt-3 text-2xl font-semibold text-neutral-950">Jadwal Tanam & Panen</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Pantau dan kelola jadwal masa tanam, estimasi panen, hingga pencatatan lahan petani untuk ketahanan pangan.
            </p>
          </div>
          <button onClick={handleOpenCreateModal} className="inline-flex h-10 w-fit items-center gap-2 rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800">
            <IconPencilPlus size={18} /> Tambah Jadwal
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm" key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-sm font-medium text-neutral-600">{item.label}</p><p className="mt-2 text-3xl font-semibold text-neutral-950">{item.value}</p></div>
              <div className={`grid h-11 w-11 place-items-center rounded-md ${item.accent}`}><item.icon size={22} /></div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-neutral-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-semibold text-neutral-950">Daftar Jadwal</h3>
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-md border border-neutral-200 px-3 text-sm text-neutral-500 lg:w-72">
            <IconSearch size={18} />
            <input className="w-full bg-transparent text-neutral-700 outline-none placeholder:text-neutral-400" placeholder="Cari nama petani / lahan..." type="search" />
          </label>
        </div>

        {isLoading ? (
          <div className="grid gap-4 p-5">
            {Array.from({ length: 3 }).map((_, idx) => <div className="h-24 animate-pulse rounded-lg bg-neutral-100" key={idx} />)}
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-red-500">{error}</div>
        ) : schedules.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {schedules.map((item) => (
              <ScheduleCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleOpenEditModal} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-medium text-neutral-500">Belum ada data jadwal pertanian terdaftar.</div>
        )}
      </section>
    </div>
  );
};