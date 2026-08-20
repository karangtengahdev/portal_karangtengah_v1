import { Table, ActionIcon, Group, Badge } from '@mantine/core';
import { IconEdit, IconMapPin, IconTrash } from '@tabler/icons-react';
import type { HarvestItem } from '../types/harvest';
import { formatDecimal, formatHarvestDate } from '../utils/formatHarvest';

type HarvestTableProps = {
  items: HarvestItem[];
  onDelete: (id: string) => void;
  onEdit: (item: HarvestItem) => void;
};

export const HarvestTable = ({ items, onDelete, onEdit }: HarvestTableProps) => {
  const rows = items.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <p className="font-medium text-[#1C2620]">{item.farmerName}</p>
        <p className="flex items-center gap-1 text-xs text-neutral-500">
          <IconMapPin size={12} /> {item.padukuhan}
        </p>
      </Table.Td>
      <Table.Td className="text-sm text-neutral-600">{formatHarvestDate(item.harvestDate)}</Table.Td>
      <Table.Td>
        <Badge color="teal" variant="light">{formatDecimal(item.ubinanKg)} Kg</Badge>
      </Table.Td>
      <Table.Td className="text-sm">{formatDecimal(item.areaHa)} Ha</Table.Td>
      <Table.Td>
        <Badge color="yellow" variant="outline">{formatDecimal(item.yieldTonHa)} Ton/Ha</Badge>
      </Table.Td>
      <Table.Td className="font-semibold text-[#1F4A34]">{formatDecimal(item.estimatedKg)} Kg</Table.Td>
      <Table.Td>
        <span className={`${item.pestLossPct > 15 ? 'text-[#C1502E] font-semibold' : 'text-neutral-600'}`}>
          {formatDecimal(item.pestLossPct)}%
        </span>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(item)} title="Edit Laporan">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => onDelete(item.id)} title="Hapus Laporan">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {/* Desktop / tablet: full table */}
      <div className="hidden sm:block overflow-x-auto">
        <Table striped highlightOnHover verticalSpacing="sm" miw={900}>
          <Table.Thead className="bg-[#F7F6EF]">
            <Table.Tr>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Nama Petani &amp; Area</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Tgl Panen</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Ubinan</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Luas Lahan</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Hasil (Ton/Ha)</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Total Estimasi</Table.Th>
              <Table.Th className="text-xs font-semibold uppercase tracking-wide text-[#8A5A3B]">Kerugian Hama</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      {/* Mobile: stacked field-record cards */}
      <div className="sm:hidden divide-y divide-neutral-100">
        {items.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-[#1C2620]">{item.farmerName}</p>
                <p className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                  <IconMapPin size={12} /> {item.padukuhan} &middot; {formatHarvestDate(item.harvestDate)}
                </p>
              </div>
              <Group gap={4}>
                <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(item)} title="Edit Laporan">
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" color="red" onClick={() => onDelete(item.id)} title="Hapus Laporan">
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 rounded-md bg-[#F7F6EF] p-3 text-xs">
              <div>
                <p className="text-neutral-500">Ubinan</p>
                <p className="font-semibold text-[#1C2620]">{formatDecimal(item.ubinanKg)} Kg</p>
              </div>
              <div>
                <p className="text-neutral-500">Luas</p>
                <p className="font-semibold text-[#1C2620]">{formatDecimal(item.areaHa)} Ha</p>
              </div>
              <div>
                <p className="text-neutral-500">Hasil</p>
                <p className="font-semibold text-[#1C2620]">{formatDecimal(item.yieldTonHa)} T/Ha</p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#1F4A34]">Estimasi: {formatDecimal(item.estimatedKg)} Kg</span>
              <span className={item.pestLossPct > 15 ? 'text-[#C1502E] font-semibold' : 'text-neutral-600'}>
                Hama {formatDecimal(item.pestLossPct)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};