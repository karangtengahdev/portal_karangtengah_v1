import { IconMapPin, IconPlant2, IconTractor } from '@tabler/icons-react';
import type { PadukuhanStat } from '../types/pertanian';
import { formatDecimal } from '../utils/formatPertanian';

type PadukuhanStatCardProps = {
  stat: PadukuhanStat;
};

export const PadukuhanStatCard = ({ stat }: PadukuhanStatCardProps) => {
  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-[#e5ecdf] bg-white p-6 shadow-[0_8px_24px_rgba(16,23,8,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(16,23,8,0.12)]">
      <div className="absolute -right-6 -top-6 grid h-24 w-24 place-items-center rounded-full bg-[#f4f8f1] text-[#d1e8bc] transition duration-500 group-hover:scale-110">
        <IconPlant2 size={56} stroke={1.5} className="-ml-3 mt-3" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-[#4f842f]">
          <IconMapPin size={20} stroke={2} />
          <h3 className="text-lg font-bold uppercase tracking-wide text-[#101708]">
            Padukuhan {stat.padukuhan}
          </h3>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <p className="text-4xl font-extrabold text-[#72b841]">
            {formatDecimal(stat.avgYieldTonHa)}
          </p>
          <p className="text-sm font-semibold text-[#626b5f]">Ton/Ha</p>
        </div>
        <p className="mt-1 text-sm font-medium text-[#626b5f]">
          Rata-rata Hasil Panen
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f9fbf7] px-4 py-3 text-sm font-semibold text-[#3d453b]">
          <IconTractor size={18} className="text-[#62a23a]" />
          <span>Dari {stat.count} laporan petani</span>
        </div>
      </div>
    </article>
  );
};