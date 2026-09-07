import { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Switch, Button, Group, Stack, Divider } from '@mantine/core';
import type { PadukuhanItem, PadukuhanPayload } from '../types/padukuhan';

type PadukuhanModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: PadukuhanPayload) => Promise<void>;
  initialData?: PadukuhanItem | null;
  isSubmitting: boolean;
};

export const PadukuhanModal = ({ opened, onClose, onSubmit, initialData, isSubmitting }: PadukuhanModalProps) => {
  const [name, setName] = useState('');
  const [kepalaDukuh, setKepalaDukuh] = useState('');
  const [sambutan, setSambutan] = useState('');
  const [description, setDescription] = useState('');
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setKepalaDukuh(initialData.kepalaDukuh ?? '');
      setSambutan(initialData.sambutan ?? '');
      setDescription(initialData.description ?? '');
      setHasData(initialData.hasData);
    } else {
      setName('');
      setKepalaDukuh('');
      setSambutan('');
      setDescription('');
      setHasData(false);
    }
  }, [initialData, opened]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      kepalaDukuh: kepalaDukuh || undefined,
      sambutan: sambutan || undefined,
      description: description || undefined,
      hasData,
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span className="text-lg font-semibold text-[#1C2620]">
          {initialData ? 'Edit Padukuhan' : 'Tambah Padukuhan'}
        </span>
      }
      size="lg"
      centered
      radius="md"
      classNames={{ content: "font-['Plus_Jakarta_Sans']" }}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack gap="md">
          <TextInput
            label="Nama Padukuhan"
            placeholder="Misal: Karangtengah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextInput
            label="Nama Kepala Dukuh"
            placeholder="Misal: Sumardiyono"
            value={kepalaDukuh}
            onChange={(e) => setKepalaDukuh(e.target.value)}
          />
          <Textarea
            label="Sambutan Kepala Dukuh"
            description="Tampil di halaman publik (Beranda) -- isi kalau sudah ada teks sambutan resmi"
            placeholder="Selamat datang di Padukuhan..."
            value={sambutan}
            onChange={(e) => setSambutan(e.target.value)}
            rows={5}
          />
          <Textarea
            label="Deskripsi Singkat"
            placeholder="Deskripsi singkat padukuhan (opsional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
            <Switch
              label="Tampilkan penuh di halaman publik"
              description='Kalau dimatikan, publik akan lihat label "Segera Hadir" untuk padukuhan ini -- gunakan ini kalau data/sambutan belum lengkap'
              checked={hasData}
              onChange={(e) => setHasData(e.currentTarget.checked)}
              styles={{ track: { cursor: 'pointer' } }}
            />
          </div>

          <Divider />
          <Group justify="flex-end" className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isSubmitting} fullWidth className="sm:w-auto">
              Batal
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              className="sm:w-auto"
              styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
            >
              {initialData ? 'Simpan Perubahan' : 'Tambah Padukuhan'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
