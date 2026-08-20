import { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Stack, NumberInput, Grid, Divider } from '@mantine/core';
import { IconSeeding } from '@tabler/icons-react';
import type { HarvestItem, HarvestPayload } from '../types/harvest';

type HarvestModalProps = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: HarvestPayload) => Promise<void>;
  initialData?: HarvestItem | null;
  isSubmitting: boolean;
};

const sectionLabelClass =
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A3B] flex items-center gap-1.5';

export const HarvestModal = ({ opened, onClose, onSubmit, initialData, isSubmitting }: HarvestModalProps) => {
  const [farmerName, setFarmerName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [padukuhan, setPadukuhan] = useState('Karangtengah');
  const [harvestDate, setHarvestDate] = useState('');
  const [ubinanKg, setUbinanKg] = useState<number | ''>('');
  const [areaHa, setAreaHa] = useState<number | ''>('');
  const [pestLossPct, setPestLossPct] = useState<number | ''>('');
  const [scheduleId, setScheduleId] = useState('');

  useEffect(() => {
    if (initialData) {
      setFarmerName(initialData.farmerName);
      setFieldName(initialData.fieldName || '');
      setPadukuhan(initialData.padukuhan);
      setHarvestDate(initialData.harvestDate.slice(0, 10)); // Potong ISO datetime jadi YYYY-MM-DD
      setUbinanKg(initialData.ubinanKg);
      setAreaHa(initialData.areaHa);
      setPestLossPct(initialData.pestLossPct);
      setScheduleId(initialData.scheduleId || '');
    } else {
      setFarmerName('');
      setFieldName('');
      setPadukuhan('Karangtengah');
      setHarvestDate('');
      setUbinanKg('');
      setAreaHa('');
      setPestLossPct('');
      setScheduleId('');
    }
  }, [initialData, opened]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      farmerName,
      fieldName: fieldName || undefined,
      padukuhan,
      harvestDate,
      ubinanKg: Number(ubinanKg),
      areaHa: Number(areaHa),
      pestLossPct: Number(pestLossPct),
      scheduleId: scheduleId || undefined,
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span className="text-lg font-semibold text-[#1C2620]">
          {initialData ? 'Edit Data Panen' : 'Input Data Panen Baru'}
        </span>
      }
      size="lg"
      centered
      radius="md"
      classNames={{ content: "font-['Plus_Jakarta_Sans']" }}
    >
      <form onSubmit={handleFormSubmit}>
        <Stack gap="lg">
          <div>
            <p className={sectionLabelClass}>Identitas Petani</p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput label="Nama Petani" placeholder="Misal: Bu Wati" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select label="Padukuhan" data={['Karangtengah', 'Sompok', 'Numpukan', 'Mojolegi']} value={padukuhan} onChange={(val) => setPadukuhan(val || 'Karangtengah')} required />
              </Grid.Col>
            </Grid>
          </div>

          <div>
            <p className={sectionLabelClass}>Waktu &amp; Lokasi Lahan</p>
            <Divider mt={6} mb="sm" color="#EDEAE0" />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput label="Nama Lahan / Sawah" placeholder="Misal: Sawah Blok A (Opsional)" value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput type="date" label="Tanggal Panen" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
              </Grid.Col>
            </Grid>
          </div>

          <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-[#8A5A3B]">
              <IconSeeding size={16} /> Data Pengukuran (Ubinan)
            </p>
            <Grid mt="xs">
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput label="Ubinan (Kg)" placeholder="Misal: 5.2" value={ubinanKg} onChange={(val) => setUbinanKg(Number(val))} min={0} decimalScale={2} required />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput label="Luas Lahan (Ha)" placeholder="Misal: 0.3" value={areaHa} onChange={(val) => setAreaHa(Number(val))} min={0} decimalScale={3} step={0.1} required />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <NumberInput label="Kerugian Hama (%)" placeholder="Misal: 10" value={pestLossPct} onChange={(val) => setPestLossPct(Number(val))} min={0} max={100} decimalScale={1} required />
              </Grid.Col>
            </Grid>
          </div>

          <TextInput label="ID Jadwal Rujukan (Opsional)" placeholder="Masukkan UUID jika data ini merujuk ke jadwal tertentu" value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} size="xs" />

          <Group justify="flex-end" mt="sm" className="border-t border-neutral-100 pt-4 flex-col-reverse gap-2 sm:flex-row sm:gap-0">
            <Button variant="subtle" color="gray" onClick={onClose} disabled={isSubmitting} fullWidth className="sm:w-auto">Batal</Button>
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              className="sm:w-auto"
              styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
            >
              {initialData ? 'Simpan Perubahan' : 'Simpan Data Panen'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};