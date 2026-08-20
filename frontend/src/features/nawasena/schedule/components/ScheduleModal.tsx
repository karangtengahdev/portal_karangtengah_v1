import { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Select, Button, Group, Stack, NumberInput, Grid } from '@mantine/core';
import type { ScheduleItem, SchedulePayload } from '../types/schedule';

type ScheduleModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: SchedulePayload) => Promise<void>;
  initialData?: ScheduleItem | null;
  isSubmitting: boolean;
};

export const ScheduleModal = ({ opened, onClose, onSubmit, initialData, isSubmitting }: ScheduleModalProps) => {
  const [farmerName, setFarmerName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [padukuhan, setPadukuhan] = useState('Karangtengah');
  const [plantDate, setPlantDate] = useState('');
  const [estimatedHarvest, setEstimatedHarvest] = useState('');
  const [cropDays, setCropDays] = useState<number | ''>(115);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setFarmerName(initialData.farmerName);
      setFieldName(initialData.fieldName || '');
      setPadukuhan(initialData.padukuhan);
      // Backend return format ISO "2026-06-22T00:00...", kita potong 10 karakter awal untuk input type="date"
      setPlantDate(initialData.plantDate.slice(0, 10));
      setEstimatedHarvest(initialData.estimatedHarvest.slice(0, 10));
      setCropDays(115); // Default, karena API get tidak return cropDays, kita set default
      setNotes(initialData.notes || '');
    } else {
      setFarmerName('');
      setFieldName('');
      setPadukuhan('Karangtengah');
      setPlantDate('');
      setEstimatedHarvest('');
      setCropDays(115);
      setNotes('');
    }
  }, [initialData, opened]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      farmerName,
      fieldName: fieldName || undefined,
      padukuhan,
      plantDate,
      estimatedHarvest,
      cropDays: Number(cropDays),
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={initialData ? 'Edit Jadwal Tanam' : 'Tambah Jadwal Tanam'} size="lg" centered>
      <form onSubmit={handleFormSubmit}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={6}>
              <TextInput label="Nama Petani" placeholder="Misal: Pak Sutrisno" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select label="Padukuhan" data={['Karangtengah', 'Sompok', 'Numpukan', 'Mojolegi']} value={padukuhan} onChange={(val) => setPadukuhan(val || 'Karangtengah')} required />
            </Grid.Col>
          </Grid>

          <TextInput label="Nama Lahan / Sawah" placeholder="Misal: Sawah Blok A (Opsional)" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />

          <Grid>
            <Grid.Col span={4}>
              <TextInput type="date" label="Tanggal Tanam" value={plantDate} onChange={(e) => setPlantDate(e.target.value)} required />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput label="Usia Panen (Hari)" placeholder="115" value={cropDays} onChange={(val) => setCropDays(Number(val))} min={1} required />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput type="date" label="Estimasi Panen" value={estimatedHarvest} onChange={(e) => setEstimatedHarvest(e.target.value)} required />
            </Grid.Col>
          </Grid>

          <Textarea label="Catatan Tambahan" placeholder="Varietas, kondisi pupuk, dll..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

          <Group justify="flex-end" mt="xl" className="border-t border-neutral-100 pt-4">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" color="emerald.7" loading={isSubmitting}>{initialData ? 'Simpan Perubahan' : 'Tambah Jadwal'}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};