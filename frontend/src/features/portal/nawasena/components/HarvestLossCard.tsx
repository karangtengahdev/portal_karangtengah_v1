import {
  IconChartBar,
  IconLeaf,
  IconPlant2,
  IconTrendingDown,
  IconWifi,
} from '@tabler/icons-react';

const indicators = [
  {
    icon: IconTrendingDown,
    label: '18% turun',
  },
  {
    icon: IconPlant2,
    label: 'Prediksi panen',
  },
  {
    icon: IconWifi,
    label: 'IoT aktif',
  },
];

export const HarvestLossCard = () => (
  <article className="flex h-full min-h-[320px] flex-col justify-between rounded-[26px] border border-[rgba(31,65,38,0.10)] bg-[#FCFCF8] p-6 text-[#182119] shadow-[0_8px_22px_rgba(22,42,25,0.06)]">
    <div>
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#EAF6E5] text-[#2F6D18]">
          <IconLeaf aria-hidden="true" size={22} stroke={1.9} />
        </span>
        <div>
          <h2 className="text-lg font-bold leading-tight">Kerugian Panen Turun</h2>
          <p className="mt-1 text-sm text-[#667067]">Dari perkiraan awal</p>
        </div>
      </div>

      <div className="mt-7 grid items-center gap-7 2xl:grid-cols-[minmax(0,1fr)_168px]">
        <div className="grid gap-3">
          {indicators.map(({ icon: Icon, label }, index) => (
            <span
              className="inline-flex min-h-10 items-center gap-3 whitespace-nowrap rounded-full border border-[rgba(31,65,38,0.10)] bg-white px-4 text-sm font-semibold text-[#334035] shadow-sm"
              key={label}
            >
              <span
                className={[
                  'grid h-7 w-7 place-items-center rounded-full',
                  index === 0
                    ? 'bg-[#EAF6E5] text-[#2F6D18]'
                    : 'bg-[#F3F6EF] text-[#4F842F]',
                ].join(' ')}
              >
                <Icon aria-hidden="true" size={16} stroke={1.9} />
              </span>
              {label}
            </span>
          ))}
        </div>

        <div className="nawasena-harvest-donut mx-auto grid h-[168px] w-[168px] place-items-center rounded-full">
          <div className="grid h-[124px] w-[124px] place-items-center rounded-full bg-[#FCFCF8] shadow-[inset_0_0_0_1px_rgba(31,65,38,0.08)]">
            <div className="text-center">
              <p className="text-4xl font-extrabold leading-none tracking-normal">
                18%
              </p>
              <p className="mt-2 text-sm font-bold text-[#2F6D18]">
                Target turun
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-[#667067]">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#4F5B52] shadow-sm">
        <IconChartBar aria-hidden="true" size={18} stroke={1.8} />
      </span>
      3 indikator aktif
    </p>
  </article>
);
