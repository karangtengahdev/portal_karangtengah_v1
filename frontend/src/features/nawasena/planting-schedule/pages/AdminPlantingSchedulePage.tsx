import React, { useState } from 'react';
import { Container, Title, Text, Button, Group, Select, Paper, Modal, TextInput, ActionIcon } from '@mantine/core';
import { IconPlus, IconPlant, IconCalendarStats, IconCalendarEvent } from '@tabler/icons-react';
import { useAdminPlantingSchedule, useKomoditas } from '../hooks/usePlantingSchedule';
import { MusimTanamCard } from '../components/MusimTanamCard';
import { MusimTanamModal } from '../components/MusimTanamModal';
import type { MusimTanam } from '../types/plantingSchedule';

export const AdminPlantingSchedulePage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const {
    data,
    loading,
    error,
    loadData,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateTahapan,
    handleUpdateTahapan,
    handleDeleteTahapan,
  } = useAdminPlantingSchedule();

  const { komoditas, handleCreateKomoditas } = useKomoditas();

  const [musimModalOpened, setMusimModalOpened] = useState(false);
  const [selectedMusim, setSelectedMusim] = useState<MusimTanam | undefined>(undefined);
  
  const [komoditasModalOpened, setKomoditasModalOpened] = useState(false);
  const [komoditasNama, setKomoditasNama] = useState('');
  const [komoditasDeskripsi, setKomoditasDeskripsi] = useState('');
  const [isSubmittingKomoditas, setIsSubmittingKomoditas] = useState(false);

  // Filter local based on status if API filtering isn't enough, but usually we recall loadData
  const handleFilterChange = (val: string | null) => {
    setStatusFilter(val);
    loadData({ status: val === 'SEMUA' ? undefined : val || undefined });
  };

  const handleOpenCreateMusim = () => {
    setSelectedMusim(undefined);
    setMusimModalOpened(true);
  };

  const handleOpenEditMusim = (item: MusimTanam) => {
    setSelectedMusim(item);
    setMusimModalOpened(true);
  };

  const handleSubmitMusim = async (payload: any) => {
    if (selectedMusim) {
      return await handleUpdate(selectedMusim.id, payload);
    } else {
      return await handleCreate(payload);
    }
  };

  const submitKomoditas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!komoditasNama) return;
    setIsSubmittingKomoditas(true);
    const success = await handleCreateKomoditas({ nama: komoditasNama, deskripsi: komoditasDeskripsi || undefined });
    setIsSubmittingKomoditas(false);
    if (success) {
      setKomoditasModalOpened(false);
      setKomoditasNama('');
      setKomoditasDeskripsi('');
    }
  };

  const totalMusim = data.length;
  const totalAktif = data.filter(d => d.status === 'AKTIF').length;
  const totalTahapan = data.reduce((acc, curr) => acc + (curr.tahapan?.length || 0), 0);

  return (
    <div className="bg-[#F7F6EF] min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-[#1F4A34] text-white py-12 px-6">
        <Container size="xl">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1} className="text-3xl font-bold mb-2 text-[#D9A441]">Jadwal Tanam</Title>
              <Text className="text-gray-200 max-w-2xl">
                Kelola informasi musim tanam dan tahapan-tahapannya untuk ditampilkan di portal publik.
              </Text>
            </div>
            <Group>
              <Button 
                variant="outline" 
                color="yellow" 
                leftSection={<IconPlant size={18} />}
                onClick={() => setKomoditasModalOpened(true)}
              >
                Kelola Komoditas
              </Button>
              <Button 
                color="yellow" 
                className="bg-[#D9A441] text-[#1F4A34] hover:bg-[#c29235]"
                leftSection={<IconPlus size={18} />}
                onClick={handleOpenCreateMusim}
              >
                Tambah Musim Tanam
              </Button>
            </Group>
          </Group>
        </Container>
      </div>

      <Container size="xl" className="mt-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Paper shadow="sm" p="lg" radius="md" className="border-t-4 border-[#D9A441]">
            <Group>
              <IconCalendarEvent size={40} className="text-[#1F4A34]" stroke={1.5} />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Musim Tanam</Text>
                <Text size="xl" fw={700} className="text-[#1F4A34]">{totalMusim}</Text>
              </div>
            </Group>
          </Paper>
          <Paper shadow="sm" p="lg" radius="md" className="border-t-4 border-green-500">
            <Group>
              <IconPlant size={40} className="text-green-600" stroke={1.5} />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Musim Tanam Aktif</Text>
                <Text size="xl" fw={700} className="text-green-700">{totalAktif}</Text>
              </div>
            </Group>
          </Paper>
          <Paper shadow="sm" p="lg" radius="md" className="border-t-4 border-blue-500">
            <Group>
              <IconCalendarStats size={40} className="text-blue-600" stroke={1.5} />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total Tahapan</Text>
                <Text size="xl" fw={700} className="text-blue-700">{totalTahapan}</Text>
              </div>
            </Group>
          </Paper>
        </div>

        {/* Filters */}
        <Paper shadow="xs" p="md" mb="xl" radius="md">
          <Group justify="space-between">
            <Title order={3} size="h4" className="text-[#1F4A34]">Daftar Musim Tanam</Title>
            <Select
              placeholder="Filter Status"
              data={[
                { value: 'SEMUA', label: 'Semua Status' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'AKTIF', label: 'Aktif' },
                { value: 'SELESAI', label: 'Selesai' }
              ]}
              value={statusFilter}
              onChange={handleFilterChange}
              clearable
              className="w-48"
            />
          </Group>
        </Paper>

        {/* Data List */}
        {loading ? (
          <div className="flex justify-center p-12">
            <Text c="dimmed">Memuat data...</Text>
          </div>
        ) : error ? (
          <Paper p="xl" className="text-center bg-red-50 text-red-600">
            <Text>{error}</Text>
          </Paper>
        ) : data.length === 0 ? (
          <Paper p="xl" className="text-center bg-white border border-gray-200 py-20">
            <IconCalendarEvent size={48} className="mx-auto text-gray-300 mb-4" />
            <Text size="lg" fw={500} c="dimmed">Belum ada data musim tanam</Text>
            <Text size="sm" c="dimmed" mb="md">Mulai dengan menambahkan musim tanam baru</Text>
            <Button variant="light" color="green" onClick={handleOpenCreateMusim}>
              Tambah Musim Tanam
            </Button>
          </Paper>
        ) : (
          <div>
            {data.map((item) => (
              <MusimTanamCard
                key={item.id}
                data={item}
                onEdit={handleOpenEditMusim}
                onDelete={handleDelete}
                onCreateTahapan={handleCreateTahapan}
                onUpdateTahapan={handleUpdateTahapan}
                onDeleteTahapan={handleDeleteTahapan}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Modals */}
      <MusimTanamModal
        opened={musimModalOpened}
        onClose={() => setMusimModalOpened(false)}
        onSubmit={handleSubmitMusim}
        initialData={selectedMusim}
        komoditasList={komoditas}
      />

      <Modal opened={komoditasModalOpened} onClose={() => setKomoditasModalOpened(false)} title="Kelola Komoditas" size="md">
        <form onSubmit={submitKomoditas} className="space-y-4 mb-6">
          <TextInput
            label="Nama Komoditas"
            placeholder="Contoh: Padi, Jagung, Kedelai"
            required
            value={komoditasNama}
            onChange={(e) => setKomoditasNama(e.target.value)}
          />
          <TextInput
            label="Deskripsi"
            placeholder="Deskripsi singkat"
            value={komoditasDeskripsi}
            onChange={(e) => setKomoditasDeskripsi(e.target.value)}
          />
          <Button type="submit" color="green" loading={isSubmittingKomoditas} fullWidth mt="md">
            Tambah Komoditas Baru
          </Button>
        </form>
        
        <div>
          <Text fw={600} mb="xs">Daftar Komoditas Tersedia:</Text>
          {komoditas.length === 0 ? (
            <Text size="sm" c="dimmed">Belum ada komoditas</Text>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {komoditas.map(k => (
                <Paper key={k.id} withBorder p="sm" className="bg-gray-50">
                  <Text fw={500} size="sm">{k.nama}</Text>
                  {k.deskripsi && <Text size="xs" c="dimmed">{k.deskripsi}</Text>}
                </Paper>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
