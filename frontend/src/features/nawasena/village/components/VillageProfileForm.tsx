import { useEffect, useState } from 'react';
import { TextInput, Textarea, Button, Stack, Grid, Divider, NumberInput, ActionIcon } from '@mantine/core';
import { IconDeviceFloppy, IconPlus, IconSeeding, IconTrash } from '@tabler/icons-react';
import type { VillageItem, VillagePayload, VillagePotency } from '../types/village';

type VillageProfileFormProps = {
  initialData: VillageItem;
  onSubmit: (payload: VillagePayload) => Promise<void>;
  isSubmitting: boolean;
};

const sectionLabelClass =
  'text-xs font-semibold uppercase tracking-[0.14em] text-[#8A5A3B] flex items-center gap-1.5';

export const VillageProfileForm = ({ initialData, onSubmit, isSubmitting }: VillageProfileFormProps) => {
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [description, setDescription] = useState('');
  const [population, setPopulation] = useState<number | ''>('');
  const [families, setFamilies] = useState<number | ''>('');
  const [areaHa, setAreaHa] = useState<number | ''>('');
  const [potency, setPotency] = useState<VillagePotency[]>([]);

  useEffect(() => {
    setVision(initialData.vision ?? '');
    setMission(initialData.mission ?? '');
    setDescription(initialData.description ?? '');
    setPopulation(initialData.stats?.population ?? 0);
    setFamilies(initialData.stats?.families ?? 0);
    setAreaHa(initialData.stats?.area_ha ?? 0);
    setPotency(initialData.potency ?? []);
  }, [initialData]);

  const handlePotencyChange = (index: number, field: keyof VillagePotency, value: string) => {
    const newPotency = [...potency];
    newPotency[index] = { ...newPotency[index], [field]: value };
    setPotency(newPotency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      vision,
      mission,
      description,
      stats: { population: Number(population), families: Number(families), area_ha: Number(areaHa) },
      potency,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6">
      <Stack gap="lg">
        <div>
          <p className={sectionLabelClass}>Visi, Misi &amp; Deskripsi</p>
          <Divider mt={6} mb="sm" color="#EDEAE0" />
          <Stack gap="md">
            <Textarea label="Visi Desa" value={vision} onChange={(e) => setVision(e.target.value)} rows={2} required />
            <Textarea label="Misi Desa" value={mission} onChange={(e) => setMission(e.target.value)} rows={3} required />
            <Textarea label="Deskripsi Umum" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
          </Stack>
        </div>

        <div className="rounded-lg border border-[#D9A441]/40 bg-[#D9A441]/10 p-4">
          <p className="text-sm font-semibold text-[#8A5A3B]">Statistik Utama Desa</p>
          <Grid mt="xs">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <NumberInput label="Total Penduduk" value={population} onChange={(v) => setPopulation(Number(v))} min={0} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <NumberInput label="Total Kepala Keluarga (KK)" value={families} onChange={(v) => setFamilies(Number(v))} min={0} required />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <NumberInput label="Luas Wilayah (Ha)" value={areaHa} onChange={(v) => setAreaHa(Number(v))} min={0} required />
            </Grid.Col>
          </Grid>
        </div>

        <div>
          <p className={sectionLabelClass}>
            <IconSeeding size={14} /> Potensi Desa
          </p>
          <Divider mt={6} mb="sm" color="#EDEAE0" />
          <Stack gap="sm">
            {potency.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 bg-[#F7F6EF] p-3 rounded-md border border-neutral-200 sm:flex-row sm:items-start sm:gap-3">
                <div className="flex-1 grid gap-3 md:grid-cols-2">
                  <TextInput label="Judul Potensi" placeholder="Misal: Pertanian Padi" value={item.title} onChange={(e) => handlePotencyChange(index, 'title', e.target.value)} required />
                  <TextInput label="Deskripsi Potensi" placeholder="Penjelasan singkat..." value={item.desc} onChange={(e) => handlePotencyChange(index, 'desc', e.target.value)} required />
                </div>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  className="self-end sm:self-start sm:mt-6"
                  onClick={() => setPotency(potency.filter((_, i) => i !== index))}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </div>
            ))}
            <Button
              variant="outline"
              size="xs"
              leftSection={<IconPlus size={16} />}
              onClick={() => setPotency([...potency, { title: '', desc: '' }])}
              className="w-fit"
              styles={{ root: { color: '#1F4A34', borderColor: '#1F4A34' } }}
            >
              Tambah Potensi Baru
            </Button>
          </Stack>
        </div>

        <div className="flex justify-end mt-2 pt-4 border-t border-neutral-100">
          <Button
            type="submit"
            loading={isSubmitting}
            leftSection={<IconDeviceFloppy size={18} />}
            fullWidth
            className="sm:w-auto"
            styles={{ root: { backgroundColor: '#1F4A34', '&:hover': { backgroundColor: '#173a29' } } }}
          >
            Simpan Profil
          </Button>
        </div>
      </Stack>
    </form>
  );
};