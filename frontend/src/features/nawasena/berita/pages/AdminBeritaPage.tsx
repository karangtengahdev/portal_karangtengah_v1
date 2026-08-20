import { useState } from 'react';
import { Button, Badge, ActionIcon, Loader, Table, Group, Tooltip } from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconEye, IconEyeOff, IconNews, IconPhoto } from '@tabler/icons-react';
import { useAdminBerita } from '../hooks/useBerita';
import { BeritaModal } from '../components/BeritaModal';
import type { BeritaItem, BeritaPayload } from '../types/berita';

export const AdminBeritaPage = () => {
  const {
    data,
    isLoading,
    isMutating,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleTogglePublish,
  } = useAdminBerita();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BeritaItem | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: BeritaItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleSubmit = async (payload: BeritaPayload, file: File | null) => {
    if (editing) {
      await handleUpdate(editing.id, payload, file);
    } else {
      await handleCreate(payload, file);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-[#1C2620]">
            <IconNews size={24} /> Kelola Berita
          </h1>
          <p className="text-sm text-neutral-500">Tambah, edit, dan terbitkan berita portal desa.</p>
        </div>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={openCreate}
          styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
        >
          Tulis Berita
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader color="#1F4A34" />
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 py-16 text-center text-neutral-500">
          Belum ada berita. Klik "Tulis Berita" untuk membuat yang pertama.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
            <Table.Thead className="bg-[#F7F6EF]">
              <Table.Tr>
                <Table.Th>Judul</Table.Th>
                <Table.Th>Kategori</Table.Th>
                <Table.Th>Penulis</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Aksi</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <div className="flex items-center gap-3">
                      {item.coverUrl ? (
                        <img src={item.coverUrl} alt="" className="h-10 w-14 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-neutral-100 text-neutral-400">
                          <IconPhoto size={16} />
                        </div>
                      )}
                      <span className="font-medium text-[#1C2620] line-clamp-2">{item.title}</span>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="teal">{item.category ?? 'Berita'}</Badge>
                  </Table.Td>
                  <Table.Td className="text-sm text-neutral-600">{item.author ?? '-'}</Table.Td>
                  <Table.Td>
                    <Badge color={item.status === 'published' ? 'green' : 'gray'} variant="light">
                      {item.status === 'published' ? 'Terbit' : 'Draft'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="flex-end">
                      <Tooltip label={item.status === 'published' ? 'Jadikan draft' : 'Terbitkan'}>
                        <ActionIcon
                          variant="subtle"
                          color={item.status === 'published' ? 'gray' : 'green'}
                          onClick={() => handleTogglePublish(item.id)}
                        >
                          {item.status === 'published' ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <ActionIcon variant="subtle" color="blue" onClick={() => openEdit(item)}>
                          <IconEdit size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Hapus">
                        <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item.id)}>
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}

      <BeritaModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editing}
        isSubmitting={isMutating}
      />
    </div>
  );
};
