import type { ComponentType } from 'react';
import { IconChartBar, IconRobot } from '@tabler/icons-react';

type IconComponent = ComponentType<{
  className?: string;
  size?: number;
  stroke?: number;
}>;

const summaryItems: Array<{
  helper: string;
  icon: IconComponent;
  label: string;
  value: string;
}> = [
  {
    helper: 'Perangkap aktif',
    icon: IconChartBar,
    label: 'Perangkat Aktif',
    value: '4',
  },
  {
    helper: 'Jalur tengah',
    icon: IconRobot,
    label: 'Rover Beroperasi',
    value: '1',
  },
];

export const DeviceSummaryPanel = () => (
  <article className="grid rounded-[22px] border border-white/30 bg-white/16 text-white shadow-[0_16px_42px_rgba(0,0,0,0.18)] ring-1 ring-white/10 backdrop-blur-2xl sm:grid-cols-2">
    {summaryItems.map(({ helper, icon: Icon, label, value }, index) => (
      <div
        className={[
          'flex min-h-[104px] items-center gap-3 p-4',
          index > 0 ? 'border-t border-white/16 sm:border-l sm:border-t-0' : '',
        ].join(' ')}
        key={label}
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/22 bg-white/18 shadow-inner shadow-white/15">
          <Icon aria-hidden="true" size={23} stroke={1.8} />
        </span>
        <div>
          <p className="text-4xl font-extrabold leading-none tracking-normal">
            {value}
          </p>
          <p className="mt-1.5 text-xs font-bold leading-tight text-white">
            {label}
          </p>
          <p className="mt-1 text-xs text-white/62">{helper}</p>
        </div>
      </div>
    ))}
  </article>
);
