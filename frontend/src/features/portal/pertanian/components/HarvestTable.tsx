import { IconLeaf, IconBug } from '@tabler/icons-react';
import type { PublicHarvestItem } from '../types/pertanian';
import { formatDecimal, formatPertanianDate } from '../utils/formatPertanian';

type HarvestTableProps = {
  items: PublicHarvestItem[];
};

export const HarvestTable = ({ items }: HarvestTableProps) => {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e5ecdf] bg-white shadow-[0_8px_24px_rgba(16,23,8,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#3d453b]">
          <thead className="bg-[#f4f8f1] text-[#101708]">
            <tr>
              <th className="whitespace-nowrap px-6 py-4 font-bold">Nama Petani</th>
              <th className="whitespace-nowrap px-6 py-4 font-bold">Lahan & Asal</th>
              <th className="whitespace-nowrap px-6 py-4 font-bold">Tgl Panen</th>
              <th className="whitespace-nowrap px-6 py-4 font-bold">Hasil Panen</th>
              <th className="whitespace-nowrap px-6 py-4 font-bold">Persentase Hama</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5ecdf]">
            {items.map((item) => (
              <tr key={item.id} className="transition hover:bg-[#fafbf8]">
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#101708]">
                  {item.farmerName}
                </td>
                <td className="px-6 py-4">
                  <span className="block font-medium text-[#212529]">{item.padukuhan}</span>
                  {item.fieldName && (
                    <span className="block text-xs text-[#6C757D]">{item.fieldName}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {formatPertanianDate(item.harvestDate)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f4dc] px-3 py-1 font-bold text-[#4f842f]">
                    <IconLeaf size={16} />
                    {formatDecimal(item.yieldTonHa)} Ton/Ha
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 text-orange-600">
                    <IconBug size={16} />
                    <span className="font-semibold">{formatDecimal(item.pestLossPct)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};