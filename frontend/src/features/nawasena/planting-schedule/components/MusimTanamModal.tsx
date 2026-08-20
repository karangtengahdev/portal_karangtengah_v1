import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Select, Button, Group } from '@mantine/core';
import type { CreateMusimTanamPayload, MusimTanam, Komoditas } from '../types/plantingSchedule';

interface MusimTanamModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMusimTanamPayload) => Promise<boolean>;
  initialData?: MusimTanam;
  komoditasList: Komoditas[];
}

export const MusimTanamModal: React.FC<MusimTanamModalProps> = ({
  opened,
  onClose,
  onSubmit,
  initialData,
  komoditasList,
}) => {
  const [judul, setJudul] = useState('');
  const [komoditasId, setKomoditasId] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'AKTIF' | 'SELESAI'>('DRAFT');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (opened) {
      if (initialData) {
        setJudul(initialData.judul);
        setKomoditasId(initialData.komoditasId);
        setLokasi(initialData.lokasi || '');
        setTanggalMulai(initialData.tanggalMulai ? initialData.tanggalMulai.split('T')[0] : '');
        setTanggalSelesai(initialData.tanggalSelesai ? initialData.tanggalSelesai.split('T')[0] : '');
        setStatus(initialData.status);
      } else {
        setJudul('');
        setKomoditasId('');
        setLokasi('');
        setTanggalMulai('');
        setTanggalSelesai('');
        setStatus('DRAFT');
      }
    }
  }, [opened, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload: CreateMusimTanamPayload = {
      judul,
      komoditasId,
      lokasi: lokasi || undefined,
      tanggalMulai: tanggalMulai ? new Date(tanggalMulai).toISOString() : undefined,
      tanggalSelesai: tanggalSelesai ? new Date(tanggalSelesai).toISOString() : undefined,
      status,
    };

    const success = await onSubmit(payload);
    setSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={initialData ? 'Edit Musim Tanam' : 'Tambah Musim Tanam'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Judul"
          placeholder="Contoh: Musim Tanam Padi Gadu 2024"
          required
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />
        
        <Select
          label="Komoditas"
          placeholder="Pilih komoditas"
          required
          data={komoditasList.map(k => ({ value: k.id, label: k.nama }))}
          value={komoditasId}
          onChange={(val) => setKomoditasId(val || '')}
        />
        
        <TextInput
          label="Lokasi"
          placeholder="Blok persawahan atau lokasi lahan"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Tanggal Mulai"
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
          />
          <TextInput
            label="Tanggal Selesai"
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
          />
        </div>
        
        <Select
          label="Status"
          required
          data={[
            { value: 'DRAFT', label: 'Draft' },
            { value: 'AKTIF', label: 'Aktif' },
            { value: 'SELESAI', label: 'Selesai' }
          ]}
          value={status}
          onChange={(val) => setStatus(val as any || 'DRAFT')}
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={submitting}>Batal</Button>
          <Button type="submit" color="green" loading={submitting}>Simpan</Button>
        </Group>
      </form>
    </Modal>
  );
};
