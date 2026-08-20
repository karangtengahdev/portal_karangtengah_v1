import { IconCalendarEvent, IconEdit, IconLeaf, IconMapPin, IconPlant, IconTractor, IconTrash } from '@tabler/icons-react';
import type { ScheduleItem } from '../types/schedule';
import { formatScheduleDate, getScheduleStatusClass, getScheduleStatusLabel } from '../utils/formatSchedule';

type ScheduleCardProps = {
  item: ScheduleItem;
  onDelete: (id: string) => void;
  onEdit: (item: ScheduleItem) => void;
};

export const ScheduleCard = ({ item, onDelete, onEdit }: ScheduleCardProps) => {
  return (
    <article className="p-5 flex flex-col gap-4 lg:flex-row lg:items-center justify-between">
      <div className="flex gap-4">
        {/* Ikon Kiri */}
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <IconTractor size={24} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${getScheduleStatusClass(item.status)}`}>
              {item.status === 'planted' ? <IconPlant size={12} /> : <IconLeaf size={12} />}
              {getScheduleStatusLabel(item.status)}
            </span>
          </div>
          <h4 className="text-base font-semibold text-neutral-950">
            {item.farmerName} {item.fieldName ? `- ${item.fieldName}` : ''}
          </h4>
          
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <p className="flex items-center gap-1.5"><IconMapPin size={16} className="text-neutral-400"/> {item.padukuhan}</p>
            <p className="flex items-center gap-1.5"><IconCalendarEvent size={16} className="text-emerald-500"/> Tanam: <span className="font-medium text-neutral-800">{formatScheduleDate(item.plantDate)}</span></p>
            <p className="flex items-center gap-1.5"><IconCalendarEvent size={16} className="text-amber-500"/> Panen: <span className="font-medium text-neutral-800">{formatScheduleDate(item.estimatedHarvest)}</span></p>
          </div>

          {item.notes && (
            <p className="mt-2 text-sm text-neutral-500 bg-neutral-50 p-2 rounded border border-neutral-100">
              Catatan: {item.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 lg:flex-col shrink-0">
        <button onClick={() => onEdit(item)} className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100">
          <IconEdit size={18} />
        </button>
        <button onClick={() => onDelete(item.id)} className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 text-red-600 transition hover:bg-red-50">
          <IconTrash size={18} />
        </button>
      </div>
    </article>
  );
};