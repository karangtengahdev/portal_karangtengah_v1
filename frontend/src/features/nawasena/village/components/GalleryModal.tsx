import { useState } from 'react';
import { Modal, TextInput, Button, Group, Stack, FileInput, NumberInput } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';

type GalleryModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (file: File, caption: string, orderIndex: number) => Promise<void>;
  isSubmitting: boolean;
};

export const GalleryModal = ({ opened, onClose, onSubmit, isSubmitting }: GalleryModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [orderIndex, setOrderIndex] = useState<number | ''>(0);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Silakan pilih file gambar terlebih dahulu.');
    await onSubmit(file, caption, Number(orderIndex));
    // Reset Form
    setFile(null); setCaption(''); setOrderIndex(0);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<span className="text-lg font-semibold text-[#1C2620]">Tambah Foto Galeri</span>}
      centered
      radius="md"
      classNames={{ content: "font-['Plus_Jakarta_Sans']" }}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack gap="md">
          <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[#8A5A3B]">
              <IconPhoto size={16} /> Gambar
            </p>
            <FileInput
              className="mt-3"
              placeholder="Upload file dari komputer"
              leftSection={<IconPhoto size={16} />}
              value={file}
              onChange={setFile}
              accept="image/*"
              required
              size="sm"
            />
          </div>

          <TextInput label="Keterangan (Caption)" placeholder="Misal: Suasana panen padi..." value={caption} onChange={(e) => setCaption(e.target.value)} required />
          <NumberInput label="Urutan Tampil (Order Index)" placeholder="0" value={orderIndex} onChange={(v) => setOrderIndex(Number(v))} min={0} required />

          <Group justify="flex-end" mt="md" className="border-t border-neutral-100 pt-4 flex-col-reverse gap-2 sm:flex-row sm:gap-0">
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
              Upload ke Galeri
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};