import { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Select, Button, Group, Stack, FileInput, Divider, Grid } from '@mantine/core';
import { IconNews, IconPhoto, IconWriting } from '@tabler/icons-react';
import type { BeritaItem, BeritaPayload } from '../types/berita';
import { BERITA_CATEGORIES } from '../types/berita';

type BeritaModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: BeritaPayload, file: File | null) => Promise<void>;
  initialData?: BeritaItem | null;
  isSubmitting: boolean;
};

const sectionLabelClass =
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A3B] flex items-center gap-1.5';

export const BeritaModal = ({ opened, onClose, onSubmit, initialData, isSubmitting }: BeritaModalProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>(BERITA_CATEGORIES[0]);
  const [author, setAuthor] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setExcerpt(initialData.excerpt ?? '');
      setContent(initialData.content);
      setCategory(initialData.category || BERITA_CATEGORIES[0]);
      setAuthor(initialData.author ?? '');
    } else {
      setTitle('');
      setExcerpt('');
      setContent('');
      setCategory(BERITA_CATEGORIES[0]);
      setAuthor('');
    }
    setCoverFile(null);
  }, [initialData, opened]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, excerpt, content, category, author }, coverFile);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span className="text-lg font-semibold text-[#1C2620]">
          {initialData ? 'Edit Berita' : 'Tulis Berita Baru'}
        </span>
      }
      size="xl"
      centered
      radius="md"
      classNames={{ content: "font-['Plus_Jakarta_Sans']" }}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack gap="lg">
          <div>
            <p className={sectionLabelClass}>
              <IconNews size={14} /> Informasi Berita
            </p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Stack gap="sm">
              <TextInput
                label="Judul Berita"
                placeholder="Panen Raya Perdana di Karangtengah"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Kategori"
                    data={[...BERITA_CATEGORIES]}
                    value={category}
                    onChange={(val) => setCategory(val || BERITA_CATEGORIES[0])}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Penulis"
                    placeholder="Tim Redaksi"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </Grid.Col>
              </Grid>
              <Textarea
                label="Ringkasan (Lead)"
                placeholder="Ringkasan singkat 1-2 kalimat yang tampil di kartu berita..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                required
              />
            </Stack>
          </div>

          <div>
            <p className={sectionLabelClass}>
              <IconWriting size={14} /> Isi Berita
            </p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Textarea
              placeholder="Tulis isi lengkap berita di sini..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autosize
              minRows={8}
              required
            />
          </div>

          <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[#8A5A3B]">
              <IconPhoto size={16} /> Gambar Cover
            </p>
            <FileInput
              className="mt-3"
              placeholder={initialData?.coverUrl ? 'Ganti gambar cover (opsional)' : 'Pilih file gambar (opsional)'}
              leftSection={<IconPhoto size={16} />}
              value={coverFile}
              onChange={setCoverFile}
              accept="image/*"
              clearable
              size="sm"
            />
            {initialData?.coverUrl && !coverFile && (
              <p className="mt-2 text-xs text-neutral-500">
                Sudah ada cover. Pilih file baru hanya jika ingin menggantinya.
              </p>
            )}
          </div>

          <Group justify="flex-end" mt="sm" className="border-t border-neutral-100 pt-4 flex-col-reverse gap-2 sm:flex-row sm:gap-0">
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
              {initialData ? 'Simpan Perubahan' : 'Terbitkan Berita'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
