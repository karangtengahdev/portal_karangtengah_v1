import React, { useState } from 'react';
import { Text, Group, ActionIcon, Button, Paper, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import type { TahapanJadwal, CreateTahapanPayload } from '../types/plantingSchedule';
import { TahapanModal } from './TahapanModal';

interface TahapanListProps {
  tahapan: TahapanJadwal[];
  musimTanamId: string;
  onCreateTahapan: (musimTanamId: string, payload: CreateTahapanPayload) => Promise<boolean>;
  onUpdateTahapan: (tahapanId: string, payload: Partial<CreateTahapanPayload>) => Promise<boolean>;
  onDeleteTahapan: (tahapanId: string) => Promise<boolean>;
}

export const TahapanList: React.FC<TahapanListProps> = ({
  tahapan,
  musimTanamId,
  onCreateTahapan,
  onUpdateTahapan,
  onDeleteTahapan
}) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedTahapan, setSelectedTahapan] = useState<TahapanJadwal | undefined>(undefined);

  const sortedTahapan = [...(tahapan || [])].sort((a, b) => a.urutan - b.urutan);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleOpenCreate = () => {
    setSelectedTahapan(undefined);
    setModalOpened(true);
  };

  const handleOpenEdit = (item: TahapanJadwal) => {
    setSelectedTahapan(item);
    setModalOpened(true);
  };

  const handleSubmit = async (payload: CreateTahapanPayload) => {
    if (selectedTahapan) {
      return await onUpdateTahapan(selectedTahapan.id, payload);
    } else {
      return await onCreateTahapan(musimTanamId, payload);
    }
  };

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center" mb="md">
        <Text size="sm" c="dimmed">Daftar tahapan pada musim tanam ini</Text>
        <Button 
          variant="light" 
          color="green" 
          size="xs" 
          leftSection={<IconPlus size={14} />}
          onClick={handleOpenCreate}
        >
          Tambah Tahapan
        </Button>
      </Group>

      {sortedTahapan.length === 0 ? (
        <Text c="dimmed" fs="italic" ta="center" py="md">Belum ada tahapan yang ditambahkan.</Text>
      ) : (
        <div className="space-y-2">
          {sortedTahapan.map((item) => (
            <Paper key={item.id} withBorder p="sm" radius="md" className="bg-gray-50/50">
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <div className="flex-1">
                  <Group gap="xs" mb="xs">
                    <Badge color="green" variant="filled" size="sm" circle>{item.urutan}</Badge>
                    <Text fw={600} size="sm">{item.namaTahapan}</Text>
                  </Group>
                  <Text size="xs" c="dimmed" mb="xs">
                    {formatDate(item.tanggalMulai)} {item.tanggalSelesai ? `- ${formatDate(item.tanggalSelesai)}` : ''}
                  </Text>
                  {item.deskripsi && (
                    <Text size="sm" c="gray.7">{item.deskripsi}</Text>
                  )}
                </div>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenEdit(item)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => onDeleteTahapan(item.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </div>
      )}

      <TahapanModal 
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={handleSubmit}
        initialData={selectedTahapan}
      />
    </div>
  );
};
