import { IconChartBar, IconUsers, IconClipboardList } from '@tabler/icons-react';

const summaries = [
  {
    label: 'Penduduk',
    value: '1.284',
    description: 'Total warga tercatat.',
    icon: IconUsers,
  },
  {
    label: 'Layanan',
    value: '18',
    description: 'Jenis layanan publik.',
    icon: IconClipboardList,
  },
  {
    label: 'Informasi',
    value: '42',
    description: 'Konten informasi desa.',
    icon: IconChartBar,
  },
];

export const InfografisPage = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Infografis
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
            Infografis Desa
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Ringkasan data desa dalam bentuk angka dan visual sederhana.
          </p>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {summaries.map((summary) => (
            <article
              className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
              key={summary.label}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    {summary.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-950">
                    {summary.value}
                  </p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-md bg-sky-100 text-sky-700">
                  <summary.icon size={22} />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                {summary.description}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};
