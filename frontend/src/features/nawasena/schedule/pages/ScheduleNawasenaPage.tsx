import { IconCalendarEvent, IconClock } from '@tabler/icons-react';

const schedules = [
  {
    title: 'Review konten berita',
    time: '09.00 WIB',
  },
  {
    title: 'Update data infografis',
    time: '11.00 WIB',
  },
  {
    title: 'Koordinasi program NAWASENA',
    time: '14.00 WIB',
  },
];

export const ScheduleNawasenaPage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Schedule
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
          Jadwal NAWASENA
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Jadwal sementara untuk aktivitas pengelolaan dashboard admin.
        </p>
      </section>

      <section className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white shadow-sm">
        {schedules.map((schedule) => (
          <article className="flex items-center gap-4 p-5" key={schedule.title}>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-700">
              <IconCalendarEvent size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-950">
                {schedule.title}
              </h3>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-neutral-600">
                <IconClock size={16} />
                {schedule.time}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
