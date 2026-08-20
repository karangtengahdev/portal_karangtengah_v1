import React from 'react';
import { Card, Text, Badge, Group, ActionIcon, Accordion, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconCalendar, IconMapPin, IconPlant } from '@tabler/icons-react';
import type { MusimTanam } from '../types/plantingSchedule';
import { TahapanList } from './TahapanList';
import type { CreateTahapanPayload } from '../types/plantingSchedule';

interface MusimTanamCardProps {
  data: MusimTanam;
  onEdit: (data: MusimTanam) => void;
  onDelete: (id: string) => void;
  onCreateTahapan: (musimTanamId: string, payload: CreateTahapanPayload) => Promise<boolean>;
  onUpdateTahapan: (tahapanId: string, payload: Partial<CreateTahapanPayload>) => Promise<boolean>;
  onDeleteTahapan: (tahapanId: string) => Promise<boolean>;
}

export const MusimTanamCard: React.FC<MusimTanamCardProps> = ({
  data,
  onEdit,
  onDelete,
  onCreateTahapan,
  onUpdateTahapan,
  onDeleteTahapan
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'gray';
      case 'AKTIF': return 'green';
      case 'SELESAI': return 'blue';
      default: return 'gray';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder className="mb-4">
      <Group justify="space-between" mb="xs">
        <Text fw={600} size="lg">{data.judul}</Text>
        <Group gap="xs">
          <Badge color={getStatusColor(data.status)} variant="light">
            {data.status}
          </Badge>
          <Tooltip label="Edit Musim Tanam">
            <ActionIcon variant="light" color="blue" onClick={() => onEdit(data)}>
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Hapus Musim Tanam">
            <ActionIcon variant="light" color="red" onClick={() => onDelete(data.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <IconPlant size={16} className="text-nawasena-accent" />
          <span>{data.komoditas?.nama || 'Tanpa Komoditas'}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconMapPin size={16} className="text-gray-400" />
          <span>{data.lokasi || 'Lokasi belum diset'}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendar size={16} className="text-gray-400" />
          <span>{formatDate(data.tanggalMulai)} - {formatDate(data.tanggalSelesai)}</span>
        </div>
      </div>

      <Accordion variant="separated">
        <Accordion.Item value="tahapan">
          <Accordion.Control icon={<IconCalendar size={18} />}>
            <Group justify="space-between" className="pr-4">
              <Text fw={500}>Kelola Tahapan</Text>
              <Badge color="gray" variant="outline">{data.tahapan?.length || 0} Tahapan</Badge>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <TahapanList 
              tahapan={data.tahapan} 
              musimTanamId={data.id}
              onCreateTahapan={onCreateTahapan}
              onUpdateTahapan={onUpdateTahapan}
              onDeleteTahapan={onDeleteTahapan}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};
